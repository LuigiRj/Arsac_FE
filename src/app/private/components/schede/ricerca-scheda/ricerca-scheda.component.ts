import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { debounceTime, Observable, Subject, Subscription, switchMap } from 'rxjs';
import { Scheda, TipoScheda } from 'src/app/models/scheda.model';
import { User } from 'src/app/models/shared/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UsersService } from './../../../../services/users/users.service';


@Component({
  selector: 'app-ricerca-scheda',
  templateUrl: './ricerca-scheda.component.html',
  styleUrls: ['./ricerca-scheda.component.scss']
})
export class RicercaSchedaComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  admin!: boolean;
  direzione!: boolean;
  schedatore!: boolean;
  public!: boolean;
  restoring: boolean = false;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  displayedColumns: string[] = ['visualizzazione', 'data_creazione', 'id', 'TSK', 'Titolo', '__validated', 'dettagli'];
  displayedUser: string[] = ['visualizzazione', 'data_creazione', 'id', 'TSK'];
  editItem!: any;
  dialogRef!: MatDialogRef<any, any>;
  usersDataSource!: Observable<User[]>;

  tipiSchedaDataSource!: TipoScheda[];

  protected _onDestroy = new Subject<void>();

  constructor(
    private schedeService: SchedeService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private usersService: UsersService
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      TSK: new FormControl(),
      __denominazione: new FormControl(),
      AUTN: new FormControl(),
      // RELS: new FormControl(),
      DTZG: new FormControl(),
      attive: new FormControl(),
      match_all: new FormControl(),
      __validated: new FormControl("tutte"),
      user: new FormControl(),
    });
    this.schedeService.getTipiScheda().subscribe(res => {
      this.tipiSchedaDataSource = res;
    });
    this.initAutocomplete();
    this.auth();

    this.searchForm.controls.attive.setValue(true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSort()
      this.initPaginator()
      this.search()
    }, 1000)
  }

  async auth() {
    this.admin = await this.authService.can('*:*:*')
    this.schedatore = await this.authService.can('schede:ricerca:admin')
    this.direzione = await this.authService.can('report:*:*')
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  initSort() {
    this.sort.active = "id";
    this.sort.direction = "desc";

    this.dataSource.data.sort(({ id: a }, { id: b }) => {
      return a === null ? 1 : b === null ? -1 : 0;
    });

    this.sort.sortChange.subscribe(() => {
      if (!this.dataSource.data.length) return
      this.paginator.pageIndex = 0
      this.search()
    })
  }

  initPaginator() {
    this.paginator.pageIndex = 0
    this.paginator.pageSize = 25
    this.paginator.page.subscribe(() => {
      this.search(true)
    })
  }

  initAutocomplete() {
    this.usersDataSource = this.searchForm.controls.user.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.usersService.getAutocomplete(searchQuery);
        else return this.usersDataSource;
      }));
  }

  search(keepPage?: boolean) {
    if (!keepPage) this.paginator.pageIndex = 0
    let raw = this.searchForm.getRawValue();

    if (raw.TSK) raw["CD.TSK"] = raw.TSK;
    delete raw.TSK;

    if (raw.__denominazione) raw.__denominazione = { $like: raw.__denominazione };

    if (raw.AUTN) raw["AU.AUT.AUTN"] = { $like: raw.AUTN };
    delete raw.AUTN;

    if (raw.DTZG) raw["DT.DTZ.DTZG"] = { $like: raw.DTZG };
    delete raw.DTZG;

    if (raw.match_all) raw['match_all'] = { $like: raw.match_all }

    if (raw.user) raw['__createdById'] = raw.user.id
    delete raw.user

    // if (raw.__validated === true) raw.__validated = true

    if (raw.RELS) {
      raw["RE.REL.RELS"] = { $like: raw.RELS };
      raw["RE.REV.REVS"] = { $like: raw.RELS };
    }
    delete raw.RELS;
    if (!raw.attive) {
      raw["deletedAt"] = { n: "not null" };
      this.restoring = true;
    } else {
      this.restoring = false;
    }
    delete raw.attive;

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
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
    this.searchForm.reset();
    this.sort.active = "id";
    this.searchForm.controls.attive.setValue(true);
    this.sort.direction = "desc";
    this.search()
  }

  populateTable(result: PaginationResult<any>) {
    this.dataSource.data = result.items.map((item: any) => new Object(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  edit(item: Scheda) {
    this.router.navigate(['schede', 'scheda', item.id]);
  }

  view(item: Scheda) {
    this.router.navigate(['schede', 'visualizza', item.id]);
  }

  delete(s: Scheda) {
    if (!s.id) return;
    this.schedeService.delete(s.id).subscribe(res => {
      this.utilsService.notificationsService.success('Scheda eliminata con successo');

      this.dialogRef && this.dialogRef.close();
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
    setTimeout(() => {
      this.search(true);
    }, 1000);
  }

  restore(s: Scheda) {
    if (!s.id) return;
    this.schedeService.restore(s.id).subscribe(res => {
      this.utilsService.notificationsService.success('Scheda ripristinata con successo');
      this.dialogRef && this.dialogRef.close();

    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
    setTimeout(() => {
      this.search();
    }, 1000);
  }

}
