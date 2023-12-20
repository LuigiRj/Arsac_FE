import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list/grid-list-module';
import {LayoutModule, BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Router } from '@angular/router';

export interface Tile {

  cols: number;
  rows: number;

}

@Component({
  selector: 'app-storia',
  templateUrl: './storia.component.html',
  styleUrls: ['./storia.component.scss'],

})




export class StoriaComponent implements OnInit {

  tile: Tile[] = [
    {cols: 3, rows: 1},
    {cols: 2, rows: 3},
    {cols: 3, rows: 1},
    {cols: 3, rows: 1},
  ];

 ratio: string = '3:1';

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) { }

  ngOnInit(): void {


    if(this.breakpointObserver.isMatched('(max-width: 599px)'))
    {
      this.ratio = '1:1';
      this.tile  = [
        {cols: 5, rows: 1},
        {cols: 5, rows: 5},
        {cols: 5, rows: 3},
        {cols: 5, rows: 1},
      ];
    }
  }

  navigate(page: string){
    this.router.navigateByUrl('/public/storia/'+page)
  }

}
