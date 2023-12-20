import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';
import { UtilsService } from 'src/app/services/utils.service';
import { EventiService } from '../../services/eventi.service';

@Component({
  selector: 'app-lista-eventi',
  templateUrl: './lista-eventi.component.html',
  styleUrls: ['./lista-eventi.component.scss']
})
export class ListaEventiComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  evento: MatTableDataSource<Evento> = new MatTableDataSource<Evento>()

  searchForm!: FormGroup
  searchSubscription!: Subscription

  items : Evento[] = []

  constructor(
    private eventoService: EventiService,
    private utilsService: UtilsService
  ) {
    this.evento.paginator = this.paginator;
    this.evento.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      titolo: new FormControl(''),
      testo: new FormControl(''),
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
      if (!this.evento.data.length) return
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
    this.paginator.pageSize = 8
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
    this.searchSubscription = this.eventoService.search(raw, pageRequest).subscribe(
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

  populateTable(result: PaginationResult<Evento>) {
    this.evento.data = result.items.map((item: any) => new Evento(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }


}
