import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Opera } from 'src/app/models/opera.model';
import { OpereService } from 'src/app/public/services/opere.service';

@Component({
  selector: 'app-card-opera',
  templateUrl: './card-opera.component.html',
  styleUrls: ['./card-opera.component.scss']
})
export class CardOperaComponent implements OnInit {

  @Input() opera!: Opera;

  immagine!: string;

  operaSubscription!: Subscription;

  constructor(
    private opereService: OpereService
  ) { }

  ngOnInit(): void {

    this.operaSubscription = this.opereService.getImmagini(this.opera.id).subscribe((res: any) => {
      this.immagine = res.immagini[0]
    })
  }

}
