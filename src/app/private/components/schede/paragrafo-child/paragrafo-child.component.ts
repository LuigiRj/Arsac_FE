import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SezioneComponent } from 'src/app/private/components/schede/sezione/sezione.component';
import { Paragrafo, Scheda } from 'src/app/models/scheda.model';
import { LocalRandomService } from 'src/app/services/local-random.service';


@Component({
  selector: 'app-paragrafo-child',
  templateUrl: './paragrafo-child.component.html',
  styleUrls: ['./paragrafo-child.component.scss']
})
export class ParagrafoChildComponent implements OnInit {
  @Input()
  paragrafo!: Paragrafo;
  @Input()
  public tipoScheda!: any;

  @ViewChildren(SezioneComponent) childrenComponents!: QueryList<SezioneComponent>;

  constructor( private LocalRandomService: LocalRandomService) { }

  ngOnInit(): void {
  }

  public get value() {
    return this.childrenComponents.map(c => c.value).reduce((a, e) => ({ ...a, ...e }), {});
  }

  get valid() {
    return this.childrenComponents.toArray().map(c => c.valid).reduce((a, e) => a && e, true);
  }

  patchValue(s: any): void {
    s = this.LocalRandomService.normalizeSezione(s);
    this.childrenComponents.toArray().forEach(c => {
      let value = s[c.sezione.acr];
      if (!value) return;
      c.patchValue(value);
    });
  }
}
