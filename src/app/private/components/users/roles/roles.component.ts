import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { Subscription } from 'rxjs';
import { Grant } from 'src/app/models/shared/module-navigation.model';
import { Role } from 'src/app/models/shared/role.model';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/users/roles.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();
  displayedColumns: string[] = ['id', 'descrizione', 'codice', 'dettagli'];

  editItemForm!: FormGroup;
  editItem!: Role;
  dialogRef!: MatDialogRef<any, any>;


  constructor(
    private rolesService: RolesService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  grantsDataSource: Grant[] = [];

  ngOnInit(): void {
    this.authService.getAllGrants().subscribe(res => {
      this.grantsDataSource = res;
    })

    this.initForms();
  }

  initForms() {
    this.searchForm = new FormGroup({
      descrizione: new FormControl(),
      grant: new FormControl(),
      codice: new FormControl()
    });
    this.editItemForm = new FormGroup({
      id: new FormControl(),
      descrizione: new FormControl(),
      grants: new FormControl(),
      codice: new FormControl()
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSort()
      this.initPaginator()
      this.search()
    })
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

  search(keepPage?: boolean) {
    if (!keepPage) this.paginator.pageIndex = 0
    let raw = this.searchForm.getRawValue();

    let sortProperty: string = this.sort.active;
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.rolesService.search(raw, pageRequest).subscribe(
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
    this.sort.active = "id";
    this.sort.direction = "desc";
    this.search()
  }

  populateTable(result: PaginationResult<Role>) {
    this.dataSource.data = result.items.map((item: any) => new Role(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  new() {
    this.edit(new Role)
  }

  edit(item: Role) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    this.dialogRef = this.dialog.open(this.detailsModal, { width: '30%' });
  }

  save() {
    let raw = this.editItemForm.getRawValue();
    if (!raw.parent) raw.parent = null;
    if (raw.attivo == null) raw.attivo = false;
    this.rolesService.save(raw).subscribe(res => {
      this.utilsService.notificationsService.success('Categoria inserito con successo');
      this.search(true);
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

  delete() {
    let raw = this.editItemForm.getRawValue();
    this.rolesService.delete(raw.id).subscribe(res => {
      if (res != null) {
        this.utilsService.notificationsService.success('Ruolo eliminata con successo')
        this.search();
        this.dialogRef.close();
      }
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

}
