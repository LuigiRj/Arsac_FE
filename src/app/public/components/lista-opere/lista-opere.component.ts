import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Opera } from 'src/app/models/opera.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OpereService } from '../../services/opere.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { UtilsService } from 'src/app/services/utils.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-lista-opere',
  templateUrl: './lista-opere.component.html',
  styleUrls: ['./lista-opere.component.scss']
})
export class ListaOpereComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  opere: MatTableDataSource<Opera> = new MatTableDataSource<Opera>()

  searchForm!: FormGroup
  searchSubscription!: Subscription

  items : Opera[] = []

  constructor(
    private opereService: OpereService,
    private utilsService: UtilsService
  ) {
    this.opere.paginator = this.paginator;
    this.opere.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      titolo: new FormControl(''),
      descrizione: new FormControl(''),
      autore: new FormControl(''),
    })
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
      if (!this.opere.data.length) return
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
    if(raw.descrizione) raw.descrizione = {$like: raw.descrizione}
    else delete raw.descrizione
    if(raw.autore) raw.autore = {$like: raw.autore}
    else delete raw.autore
    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize,this.sort.direction, sortProperty)
    this.searchSubscription = this.opereService.search(raw, pageRequest).subscribe(
      res => {
        this.populateTable(res)
      },
      err => {
        this.utilsService.defaultHttpErrorHandler(err)
      }
    )
  }

  reset() {
    this.searchForm.reset()
    this.searchSubscription.unsubscribe()
    this.search()
  }

  populateTable(result: PaginationResult<Opera>) {
    this.opere.data = result.items.map((item: any) => new Opera(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }


}
