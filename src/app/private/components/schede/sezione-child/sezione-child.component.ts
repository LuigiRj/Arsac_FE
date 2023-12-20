import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SezioneChild, SezioneComponent } from 'src/app/private/components/schede/sezione/sezione.component';
import { LocalRandomService } from 'src/app/services/local-random.service';

@Component({
  selector: 'app-sezione-child',
  templateUrl: './sezione-child.component.html',
  styleUrls: ['./sezione-child.component.scss']
})
export class SezioneChildComponent implements OnInit {
  @Input()
  public sezione!: SezioneChild;

  JSON = JSON;

  @ViewChildren(SezioneComponent) childrenComponents!: QueryList<SezioneComponent>;

  constructor(private LocalRandomService: LocalRandomService ) { }

  ngOnInit(): void {
  }

  get value() {
    return this.childrenComponents.map((c: SezioneComponent) => c.value).reduce((a: any, e: any) => ({ ...a, ...e }), {});
  }

  get valid() {
    return this.childrenComponents.toArray().map(c => c.valid).reduce((a, e) => a && e, true);
  }

  public patchValue(s: any) {
    s = this.LocalRandomService.normalizeSezione(s);
    this.childrenComponents.toArray().forEach((c: SezioneComponent) => {
      let value = s[c.sezione.acr];
      if (!value) return;
      c.patchValue(value);
    });
  }
}
