import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Paragrafo } from 'src/app/models/scheda.model';
import { SezioneComplessaComponent } from './../sezione-complessa/sezione-complessa.component';

@Component({
  selector: 'app-paragrafi-child',
  templateUrl: './paragrafi-child.component.html',
  styleUrls: ['./paragrafi-child.component.scss']
})
export class ParagrafiChildComponent implements OnInit {

  show = true

  @Input()
  paragrafo!: Paragrafo;
  @Input() scheda!: any
  @Input() paragrafo_acr!: any

  @ViewChildren(SezioneComplessaComponent) childrenComponents!: QueryList<SezioneComplessaComponent>;

  constructor() { }

  ngOnInit(): void {

  }

  patchValue(s: any): void {
    s = s || {}
    this.show = true
    this.childrenComponents.toArray().forEach(c => {
      let value = s[c.sezione.acr];
      if (!value) return;
      c.patchValue(value);
    });
  }

  check(e: any) {
    this.show = e
  }

}
