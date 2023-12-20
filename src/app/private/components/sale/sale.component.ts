import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { Subscription } from 'rxjs';
import { Sala } from 'src/app/models/sala.model';
import { Scheda } from 'src/app/models/scheda.model';
import { EdificiService } from 'src/app/services/edifici.service';
import { PianiService } from 'src/app/services/piani.service';
import { SaleService } from 'src/app/services/sale.service';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Edificio } from './../../../models/edificio.model';
import { Piano } from './../../../models/piano.model';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  searchSubscription!: Subscription;

  edificioSelected?: Edificio;
  pianoSelected?: Piano;
  salaSelected?: Sala;

  edificiDataSource: Edificio[] = [];
  pianiDataSource: Piano[] = [];
  saleDataSource: Sala[] = [];

  opereDataSource: MatTableDataSource<Scheda> = new MatTableDataSource<Scheda>();

  searchForm!: FormGroup

  displayedColumns = ['id', 'denominazione', 'dettagli']

  constructor(
    private saleService: SaleService,
    private pianiService: PianiService,
    private edificiService: EdificiService,
    private schedeService: SchedeService,
    private router: Router,
    public utilsService: UtilsService
  ) {
    this.opereDataSource.paginator = this.paginator;
    this.opereDataSource.sort = this.sort;
  }


  ngOnInit(): void {
    this.edificiService.search({}).subscribe(res => {
      this.edificiDataSource = res.items.map(i => new Edificio(i));
    });
    this.searchForm = new FormGroup({
      denominazione: new FormControl()
    })
  }

  loadEdificio(e: Edificio) {
    this.edificioSelected = e;
    this.pianiService.search({
      edificio: this.edificioSelected.id
    }).subscribe(res => {
      this.pianiDataSource = res.items.map(i => new Piano(i));
    })
  }

  loadPiano(p: Piano) {
    this.pianoSelected = p;
    this.saleService.search({
      piano: this.pianoSelected.id
    }).subscribe(res => {
      this.saleDataSource = res.items.map(i => new Sala(i));
    });
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.initSort()
  //     this.initPaginator()
  //   })
  // }

  init() {
    this.initSort()
    this.initPaginator()
  }

  initSort() {
    this.sort.active = "id";
    this.sort.direction = "desc";
    this.sort.sortChange.subscribe(() => {
      if (!this.opereDataSource.data.length) return
      this.paginator.pageIndex = 0
      if (this.salaSelected)
        this.search()
    })
  }

  initPaginator() {
    this.paginator.pageIndex = 0
    this.paginator.pageSize = 25
    this.paginator.page.subscribe(() => {

    })
  }

  loadSala(s: Sala) {
    this.salaSelected = s;
    setTimeout(() => {
      this.init()
      setTimeout(() => {
        this.search()
      }, 0)
    }, 0)
  }

  search() {
    if (this.searchSubscription) this.searchSubscription.unsubscribe()

    const raw = this.searchForm.getRawValue()
    raw.__salaId = this.salaSelected?.id

    if (raw.denominazione) raw.__denominazione = { $like: raw.denominazione }
    delete raw.denominazione

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)
    this.searchSubscription = this.schedeService.search(raw, pageRequest).subscribe(
      res => {
        this.populateTable(res)
      },
      err => {
        this.utilsService.defaultHttpErrorHandler(err)
      }
    )
  }

  clear() {
    this.searchForm.reset()
    this.search()
  }

  populateTable(result: PaginationResult<any>) {
    this.opereDataSource.data = result.items.map(i => new Scheda(i))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
    this.sortOpere()
  }

  sortOpere() {
    this.opereDataSource.data.sort((a, b) => {
      if (a._source.__denominazione > b._source.__denominazione) return 1;
      if (a._source.__denominazione < b._source.__denominazione) return -1;
      return 0;
    })
  }

  loadOpera(id: any) {
    if (!this.salaSelected) return
    this.router.navigate(['/schede/visualizza/', id])
  }
}
