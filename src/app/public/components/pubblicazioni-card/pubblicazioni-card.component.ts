import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pubblicazioni-card',
  templateUrl: './pubblicazioni-card.component.html',
  styleUrls: ['./pubblicazioni-card.component.scss']
})
export class PubblicazioniCardComponent implements OnInit {
  imageUrl="https://material.angular.io/assets/img/examples/shiba2.jpg";
  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  navigate(page: string){
    this.router.navigateByUrl('/public/bibliografia-e-pubblicazioni/'+page)
  }

}
