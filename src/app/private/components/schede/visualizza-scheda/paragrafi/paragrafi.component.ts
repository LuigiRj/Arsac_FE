import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Paragrafo } from 'src/app/models/scheda.model';
import { ParagrafiChildComponent } from './../paragrafi-child/paragrafi-child.component';
import { Scheda } from 'src/app/models/scheda.model';

@Component({
  selector: 'app-paragrafi',
  templateUrl: './paragrafi.component.html',
  styleUrls: ['./paragrafi.component.scss']
})
export class ParagrafiComponent implements OnInit {

  show = true
  JSON = JSON;

  @Input() public paragrafo!: Paragrafo;
  form: FormGroup = new FormGroup({});
  @Input() scheda!: any

  children: Paragrafo[] = [];
  @ViewChildren(ParagrafiChildComponent) childrenComponents!: QueryList<ParagrafiChildComponent>;


  constructor() { }

  ngOnInit() {
    this.addChildren();

  }

  ngAfterViewInit() { }

  ngOnChanges(): void { }

  addChildren(event?: any) {
    this.children.push({ ...this.paragrafo });
  }

  public patchValue(s: any) {
    let acr = this.paragrafo.acr;
    let value = s[acr];
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
