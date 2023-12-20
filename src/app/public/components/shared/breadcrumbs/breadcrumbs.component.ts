import { Component, Input, OnInit } from '@angular/core';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
