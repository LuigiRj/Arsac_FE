import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ParagrafoChildComponent } from "src/app/private/components/schede/paragrafo-child/paragrafo-child.component";
import { Paragrafo, Scheda } from "src/app/models/scheda.model";
import { SchedeService } from "src/app/services/schede/schede.service";
import { UtilsService } from "src/app/services/utils.service";
import { LocalRandomService } from "src/app/services/local-random.service";


@Component({
  selector: "app-paragrafo",
  templateUrl: "./paragrafo.component.html",
  styleUrls: ["./paragrafo.component.scss"],
})
export class ParagrafoComponent implements OnInit, OnChanges {
  @Input()
  public paragrafo!: Paragrafo;

  @Input()
  public tipoScheda!: any;


  form: FormGroup = new FormGroup({});

  children: Paragrafo[] = [];

  @ViewChildren(ParagrafoChildComponent) childrenComponents!: QueryList<ParagrafoChildComponent>;

  hasError = false;

  constructor(
    private utilsService: UtilsService,
    private schedeService: SchedeService,
    private LocalRandomService: LocalRandomService
  ) { }

  ngOnInit() {
    this.addChildren();
  }

  ngAfterViewInit() { }

  ngOnChanges(): void { }

  addChildren(event?: any) {
    this.children.push({ ...this.paragrafo });
    event && event.stopPropagation();
  }

  canDeleteChild(p: Paragrafo) {
    return this.children.length > 1;
  }

  deleteChild(p: Paragrafo) {
    this.children = this.children.filter((c) => c !== p);
  }

  get value() {
    const acr = this.paragrafo.acr;
    return {
      [acr]: this.paragrafo.rip ? this.childrenComponents.map(c => c.value) : (this.childrenComponents.first?.value || {})
    };
  }

  get valid() {
    let valid = this.childrenComponents.toArray().map(c => c.valid).reduce((a, e) => a && e, true);
    this.hasError = !valid;
    return valid;
  }

  public patchValue(s: any) {
    s = this.LocalRandomService.normalizeSezione(s);
    let acr = this.paragrafo.acr;
    let value = s[acr];
    if (!value) return;
    if (!this.paragrafo.rip) {
      this.childrenComponents.first?.patchValue(value);
      return;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (i > 0) this.addChildren();
        setTimeout(() => {
          this.childrenComponents.toArray()[i].patchValue(value[i]);
        }, 0)
      }
    }
  }
}
