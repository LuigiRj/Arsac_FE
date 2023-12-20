import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import {
  Sezione,
  SezioneComplessa,
  SezioneSemplice,
} from "src/app/models/scheda.model";
import { AuthService } from "src/app/services/auth.service";
import { SchedeService } from "src/app/services/schede/schede.service";
import { SezioneChild } from "../../sezione/sezione.component";
import { SezioneComplessaChildComponent } from "./../sezione-complessa-child/sezione-complessa-child.component";

@Component({
  selector: "app-sezione-complessa",
  templateUrl: "./sezione-complessa.component.html",
  styleUrls: ["./sezione-complessa.component.scss"],
})
export class SezioneComplessaComponent implements OnInit {

  admin!: boolean;
  pubblico!: boolean;
  privato!: boolean;

  show = true;

  @Output() showField = new EventEmitter<boolean>()

  @Input()
  public sezione!: Sezione;
  @Input() scheda!: any;
  @Input() paragrafo_acr!: string;

  @ViewChildren(SezioneComplessaChildComponent)
  childrenComponents!: QueryList<SezioneComplessaChildComponent>;

  @ViewChildren("field") fieldsComponents!: QueryList<ElementRef<any>>;

  children: SezioneChild[] = [];
  fields: Sezione[] = [];

  constructor(
    private schedeService: SchedeService,
    public authService: AuthService
  ) {}

  isArray(s: any) {
    return Array.isArray(s);
  }

  ngOnInit(): void {
    if (this.isSezioneSemplice(this.sezione)) {
      this.addField();
    }
    if (
      this.isSezioneComplessa(this.sezione) &&
      !this.sezione.rip
    ) {
      this.addChildren();
    }
    setTimeout(() => {
      this.auth()
    },);
  }

  async auth() {
    this.admin = await this.authService.can('*:*:*')
    this.pubblico = await this.authService.can('schede:visibilita:pubblico')
    this.privato = await this.authService.can('schede:visibilita:privato')
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
  }

  addField(event?: any) {
    this.fields.push({ ...this.sezione, value: "" });
  }

  patchValue(s: any): void {
    if (!s) return;

    if (this.isSezioneSemplice(this.sezione)) {

      if (this.sezione.rip) {
        console.log(this.sezione)
        this.fields = s.map((v: any) => ({ ...this.sezione, value: v }));
      } else {
        (this.fields[0] as any).value = s;

      }
      return;
    }
    if (Array.isArray(s)) {
      for (let i = 0; i <= s.length; i++) {
        if (i > 0) this.addChildren();
        if (s[i])
          setTimeout(() => {
            this.childrenComponents.toArray()[i].patchValue(s[i]);
          }, 10);
      }
      return;
    }
    this.childrenComponents.toArray().forEach((c) => c.patchValue(s));
  }



}
