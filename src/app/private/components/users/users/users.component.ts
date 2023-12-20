import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Role } from 'src/app/models/shared/role.model';
import { User } from 'src/app/models/shared/user.model';
import { RolesService } from 'src/app/services/users/roles.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'attivo', 'ruoli', 'dettagli'];
  editItemForm!: FormGroup;
  editItem!: User;
  dialogRef!: MatDialogRef<any, any>;
  ruoliDataSource!: Observable<Role[]>;
  addRoleControl: FormControl = new FormControl();
  adddipartimentoControl: FormControl = new FormControl();
  listaRuoli: Role[] = [];

  protected _onDestroy = new Subject<void>();

  constructor(
    private usersService: UsersService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private rolesService: RolesService
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      codiceFiscale: new FormControl(),
      email: new FormControl(),
      attivo: new FormControl(),
    });
    this.editItemForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      codiceFiscale: new FormControl(),
      email: new FormControl(),
    });

    this.initAutocomplete();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSort()
      this.initPaginator()
      this.search()
    })
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
    this.sort.sortChange.subscribe(() => {
      if (!this.dataSource.data.length) return
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
    this.ruoliDataSource = this.addRoleControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.rolesService.getAutocomplete(searchQuery);
        else return this.ruoliDataSource;
      })
    );
  }

  search(keepPage?: boolean) {
    if (!keepPage) this.paginator.pageIndex = 0
    let raw = this.searchForm.getRawValue();

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.usersService.search(raw, pageRequest).subscribe(
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
    this.searchForm.controls.attivo.setValue(true);
    this.sort.active = "id";
    this.sort.direction = "desc";
    this.search()
  }

  populateTable(result: PaginationResult<User>) {
    this.dataSource.data = result.items.map((item: any) => new User(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  new() {
    this.edit(new User())
  }

  edit(item: User) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    this.dialogRef = this.dialog.open(this.detailsModal);
    this.addRoleControl.reset();
  }

  save() {
    let raw = this.editItemForm.getRawValue();
    raw.roles = this.editItem.roles;
    this.usersService.save(raw).subscribe(res => {
      this.utilsService.notificationsService.success('Utente inserito correttamente');
      this.search(true);
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

  delete() {
    let raw = this.editItemForm.getRawValue();
    this.usersService.delete(raw.id).subscribe(res => {
      this.utilsService.notificationsService.success('Utente eliminato con successo');
      this.search(true);
      this.dialogRef.close();
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
  }

  addRole(r: Role) {
    if (this.editItem.roles.find(o => o.id === r.id)) {
      this.addRoleControl.reset();
      return;
    }
    this.editItem.roles.push(r);
    this.addRoleControl.reset();
  }

  removeRole(r: Role) {
    this.editItem.roles = this.editItem.roles.filter(e => {
      return e.id !== r.id;
    });
  }
}
