import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { SezioneChildComponent } from "src/app/private/components/schede/sezione-child/sezione-child.component";
import { Sezione, SezioneComplessa, SezioneSemplice} from "src/app/models/scheda.model";
import { SchedeService } from "src/app/services/schede/schede.service";
import { LocalRandomService } from "src/app/services/local-random.service";
import { ActivatedRoute } from "@angular/router";

export interface SezioneChild {
  sezioni: Sezione[];
}

export interface VocOption {
  acr?: string;
  lbl: string;
  val: any;
}

@Component({
  selector: "app-sezione",
  templateUrl: "./sezione.component.html",
  styleUrls: ["./sezione.component.scss"],
})
export class SezioneComponent implements OnInit {
  @Input()
  public sezione!: Sezione;

  JSON = JSON;

  @Input()
  public tipoScheda!: any;

  @ViewChildren(SezioneChildComponent)
  childrenComponents!: QueryList<SezioneChildComponent>;

  @ViewChildren("field") fieldsComponents!: QueryList<ElementRef<any>>;
  //select all the mat-selects in the template
  @ViewChildren(MatSelect) selectComponents!: QueryList<MatSelect>;
  children: SezioneChild[] = [];
  fields: Sezione[] = [];

  hasError = false;

  optionsDataSource: VocOption[] = [];
  filteredOptions: VocOption[] = [];

  constructor(public schedeService: SchedeService, private LocalRandomService: LocalRandomService, private ar: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.isSezioneSemplice(this.sezione)) {
      this.addField();
     // if ((this.sezione as SezioneSemplice).voc === "C") {
        this.schedeService
          .loadOrGetSigleWord(this.sezione.acr)
          .subscribe((v: any[]) => {
            if (this.sezione.acr == "TSK") {
              // v.forEach((e: any) => {
              //   this.optionsDataSource.push({ lbl: e.lbl, val: e.val });
              //   this.filteredOptions = this.optionsDataSource;
              //   if (e.val == this.tipoScheda) {
              //     (this.fields[0] as any).value = e.val;
              //   }
              // });
              (this.fields[0] as any).value = this.tipoScheda.tsk;
            } else {
              v.forEach((e: any) => {
                this.optionsDataSource.push({ lbl: this.sezione.acr, val: e });
                this.filteredOptions = this.schedeService.vocabulary.campi[this.sezione.acr][0];
              });
            }

            this.optionsDataSource.sort((a, b) =>
              a.val.toString().localeCompare(b.val.toString())
            );
          });
     // }
    }
    if (
      this.isSezioneComplessa(this.sezione) &&
      !this.sezione.rip
    ) {
      this.addChildren();
    }
  }



  isSezioneComplessa(s: Sezione) {
    return (s as SezioneComplessa).sezioni !== undefined;
  }

  isSezioneSemplice(s: Sezione) {
    return (s as SezioneSemplice).lun !== undefined;
  }

  addChildren(event?: any) {
    this.children.push({
      sezioni: (this.sezione as SezioneComplessa).sezioni.map((s: Sezione) => ({
        ...s,
      })),
    });
    event && event.stopPropagation();
  }

  canDeleteChild(c: SezioneChild) {
    if (!this.sezione.rip) return false;
    return this.children.length > (this.sezione.obb ? 1 : 0);
  }

  deleteChildren(c: SezioneChild) {
    this.children = this.children.filter((s: SezioneChild) => s !== c);
  }

  addField(event?: any) {
    this.fields.push({ ...this.sezione, value: "" });
    event && event.stopPropagation();
  }

  canAddField(f: Sezione) {
    if (!this.sezione.rip) return false;
    return this.fields[this.fields.length - 1] === f;
  }

  canDeleteField(f: Sezione) {
    return this.fields.length > 1;
  }

  deleteField(f: Sezione) {
    this.fields = this.fields.filter((s: Sezione) => s !== f);
  }

  get value(): any {
    let acr = this.sezione.acr+'_'+this.LocalRandomService.getFromLocalOrCreateNew(this.sezione.acr, this.ar.snapshot.params.id);
    if (this.isSezioneSemplice(this.sezione)) {
      return {
        [acr]: this.sezione.rip
          ? this.fields.map((s: any) => (  s.value  || ''))
          : (this.fields[0] as any).value || [],
      };
    }
    return {
      [acr]: this.sezione.rip
        ? this.childrenComponents.map((s) => ( s.value || ''))
        :  this.childrenComponents.first?.value || [],
    };
  }

  get valid(): boolean {
    if (this.isSezioneSemplice(this.sezione)) {

      this.fieldsComponents.toArray().forEach((f) => {
        f.nativeElement.dispatchEvent(new Event("focus"));
        f.nativeElement.dispatchEvent(new Event("blur"));
      });

      this.selectComponents.toArray().forEach((f) => {
        f.open()
        f.close()
      });

      let valid = this.fields.every((f: any) => {
        if (f.obb && !f.value) return false;
        if (f.lun && f.value.length > f.lun) return false;
        return true;
      });
      this.hasError = !valid;
      return valid;
    }
    const valid = this.childrenComponents
      .toArray()
      .map((c) => c.valid)
      .reduce((a, e) => a && e, true);
    this.hasError = !valid;
    return valid;
  }

  patchValue(s: any): void {
    if (!s) return;
    s = this.LocalRandomService.normalizeSezione(s);
    if (this.isSezioneSemplice(this.sezione)) {
      if (this.sezione.rip) {
        this.fields = s.map((v: any) => ({ ...this.sezione, value: v }));
      } else {
        (this.fields[0] as any).value = s;
      }
      return;
    }
    if (Array.isArray(s)) {
      for (let i = 0; i <= s.length; i++) {
        if(i > 0) this.addChildren();
        if (s[i])
          setTimeout(() => {
            this.childrenComponents.toArray()[i].patchValue(s[i]);
          }, 0);
      }
      return;
    }
    this.childrenComponents.toArray().forEach((c) => c.patchValue(s));
  }

  filter(f: any) {
    this.filteredOptions = this.optionsDataSource.filter((e: VocOption) =>
      e.val.toString().toLowerCase().includes(f.toLowerCase())
    );
  }

  filterJSONVoc(f: any, v: string) {
    this.filteredOptions = this.schedeService.vocabulary.campi[v][0].filter((e: any ) =>
      e.toString().toLowerCase().includes(f.toLowerCase())
    );
  }
}
