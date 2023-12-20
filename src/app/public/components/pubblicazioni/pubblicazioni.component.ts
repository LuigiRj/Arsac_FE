import { Component, OnInit, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list/grid-list-module';
import {LayoutModule, BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { Subscription } from 'rxjs';
import { News } from 'src/app/models/news.model';
import { UtilsService } from 'src/app/services/utils.service';
import { NewsService } from '../../services/news.service';
import { ActivatedRoute, Router } from '@angular/router';


export interface Tile {

  cols: number;
  rows: number;

}

@Component({
  selector: 'app-pubblicazioni',
  templateUrl: './pubblicazioni.component.html',
  styleUrls: ['./pubblicazioni.component.scss']
})
export class PubblicazioniComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  news: MatTableDataSource<News> = new MatTableDataSource<News>()

  searchForm!: FormGroup
  searchSubscription!: Subscription

  title =  '';
  type = '';
  typeIndex: any = {
    'biblioteca':'news',
    'bib-publ':'opere',
    'a-storico':'eventi',
  };
  items : News[] = []

  tile: Tile[] = [
    {cols: 3, rows: 1},
    {cols: 2, rows: 3},
    {cols: 3, rows: 1},
    {cols: 3, rows: 1},
  ];

 ratio: string = '3:1';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private newsService: NewsService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute,)
    {
      this.news.paginator = this.paginator;
    this.news.sort = this.sort;
    this.title = this.prepareTitle(this.router.url)
    this.type = this.typeIndex[this.route.snapshot.data['type']];

    console.log(this.type);
    }

  ngOnInit(): void {
    this.newsService.setBaseUrlAdd(this.type);
    this.searchForm = new FormGroup({
      titolo: new FormControl(''),
      testo: new FormControl(''),
    })


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



ngOnDestroy(){
  this.newsService.resetBaseUrl();
}

ngAfterViewInit(): void {
  setTimeout(() => {
    this.initPaginator()
    this.initSort()
    this.search()
  })
}


initSort() {
  this.sort.active = "id";
  this.sort.direction = "desc";
  this.sort.sortChange.subscribe(() => {
    if (!this.news.data.length) return
    this.search()
  })
}

sortBy(event: any) {
  this.sort.active = "id";
  this.sort.direction = event.value;
  this.search()
}

initPaginator() {
  this.paginator.pageIndex = 0
  this.paginator.pageSize = 9
  this.paginator.page.subscribe(() => {
    this.search(true)
  })
}

search(keepPage?: boolean) {
  if(!keepPage) this.paginator.pageIndex = 0
  const raw = this.searchForm.getRawValue()
  if(raw.titolo) raw.titolo = {$like: raw.titolo}
  else delete raw.titolo
  if(raw.testo) raw.testo = {$like: raw.testo}
  else delete raw.testo
  let sortProperty: string = this.sort.active
  let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize,this.sort.direction, sortProperty)
  this.searchSubscription = this.newsService.search(raw, pageRequest).subscribe(
    res => {
      this.populateTable(res)
    },
    err => {
      this.utilsService.defaultHttpErrorHandler(err)
    }
  )
}

prepareTitle(title: string){
  var element = title.split("/").pop() || '';
  element = element.replace(/-/g, ' ') ;
  element = this.capitalizeFirstLetter(element);
  return element;
}

capitalizeFirstLetter(string: string) {
return string.charAt(0).toUpperCase() + string.slice(1);
}

reset() {
this.searchForm.reset()
this.searchSubscription.unsubscribe()
this.search()
}

populateTable(result: PaginationResult<News>) {
this.news.data = result.items.map((item: any) => new News(item))
let interval = setInterval(() => {
  if (this.paginator) {
    this.paginator.length = result.total
    clearInterval(interval)
  }
}, 200)
}

}
function ngOnDestroy() {
  throw new Error('Function not implemented.');
}

function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

