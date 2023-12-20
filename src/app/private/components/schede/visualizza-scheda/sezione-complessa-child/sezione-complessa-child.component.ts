import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Sezione, SezioneComplessa, SezioneSemplice } from 'src/app/models/scheda.model';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { SezioneChild, VocOption } from '../../sezione/sezione.component';
import { SezioneComplessaComponent } from '../sezione-complessa/sezione-complessa.component';

@Component({
  selector: 'app-sezione-complessa-child',
  templateUrl: './sezione-complessa-child.component.html',
  styleUrls: ['./sezione-complessa-child.component.scss']
})
export class SezioneComplessaChildComponent implements OnInit {

  show = true
  @Input()
  public sezione!: any;
  @Input() paragrafo_acr!: string;
  @Input() sezione_name!: string;
  @Input() scheda!: any
  JSON = JSON;
  @ViewChildren(SezioneComplessaComponent) childrenComponents!: QueryList<SezioneComplessaComponent>;

  propertyV!: any;

  constructor(
    private schedeService: SchedeService
  ) {

   }

  ngOnInit(): void {

  }

  isArray(s: any) {
    return Array.isArray(s);
  }

  public patchValue(s: any) {
    console.log('s->',s);
    this.show = true
    this.childrenComponents.toArray().forEach((c: SezioneComplessaComponent) => {
      let value = s[c.sezione.acr];
      if (!value) {
        this.show = false
        return
      };
      c.patchValue(value);
    });
  }


}
