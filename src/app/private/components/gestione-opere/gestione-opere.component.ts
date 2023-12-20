import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { NgxUploadFile, NgxUploadService } from '@sinapsys/ngx-upload';
import { Subject, Subscription } from 'rxjs';
import { Opera } from 'src/app/models/opera.model';
import { OpereService } from 'src/app/public/services/opere.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gestione-opere',
  templateUrl: './gestione-opere.component.html',
  styleUrls: ['./gestione-opere.component.scss']
})
export class GestioneOpereComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  JSON = JSON;

  dataSource: MatTableDataSource<Opera> = new MatTableDataSource<Opera>();

  displayedColumns: string[] = ['id', 'tipo', 'titolo', 'autore', 'dettagli'];
  editItemForm!: FormGroup;
  editItem!: Opera;
  dialogRef!: MatDialogRef<any, any>;

  imageUrl!: string;

  protected _onDestroy = new Subject<void>();

  constructor(
    private OpereService: OpereService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private uploadService: NgxUploadService,
    private timelineService: TimelineService,
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      id: new FormControl(),
      id_opera: new FormControl(),
      titolo: new FormControl(),
      descrizione: new FormControl(),
      autore: new FormControl(),
      tipo: new FormControl(),
      immagini: new FormControl(),
    });
    this.editItemForm = new FormGroup({
      id: new FormControl(),
      id_opera: new FormControl(),
      titolo: new FormControl(),
      descrizione: new FormControl(),
      autore: new FormControl(),
      tipo: new FormControl(),
      immagini: new FormControl(""),
      supporto: new FormControl(),
      dimensioni: new FormControl(),
      anno: new FormControl(),
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
  }

  search(keepPage?: boolean) {
    if (!keepPage) this.paginator.pageIndex = 0
    let raw = this.searchForm.getRawValue();

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.OpereService.search(raw, pageRequest).subscribe(
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

  populateTable(result: PaginationResult<Opera>) {
    this.dataSource.data = result.items.map((item: any) => new Opera(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  new() {
    this.edit(new Opera())
  }

  edit(item: Opera) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    this.dialogRef = this.dialog.open(this.detailsModal);
  }

  save() {
    let raw = this.editItemForm.getRawValue();
    this.OpereService.save(raw).subscribe(res => {
      this.utilsService.notificationsService.success('Opera inserita correttamente');
      this.search(true);
      if(!raw.id) {
        this.timelineService.save({
          tipo_timeline: 'Arrivo',
          data: new Date(),
          descrizione: 'Arrivo opera',
          id_opera: res.id,
         } as any).subscribe(res => {})
      }
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

  delete() {
    let raw = this.editItemForm.getRawValue();
    this.OpereService.delete(raw.id).subscribe(res => {
      this.utilsService.notificationsService.success('Opera eliminata con successo');
      this.search(true);
      this.dialogRef.close();
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.editItemForm.patchValue({ image: file });
    this.editItemForm.controls.immagini.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  handleUpload(files: NgxUploadFile[]) {
    let immagini = this.editItemForm.controls.immagini.value || [];
    immagini.push(...files);
    this.editItemForm.controls.immagini.setValue(immagini);
  }

  handleUploadError(error: string) {
    this.utilsService.notificationsService.error(error);
  }

  downloadFile(f: NgxUploadFile) {
    this.uploadService.download(f).subscribe(res => {
      this.utilsService.saveAs(res as any, f.originalFilename);
    })
  }

  deleteFile(f: NgxUploadFile) {
    this.uploadService.delete(f).subscribe(res => {
      let all = this.editItemForm.controls.immagini.value || [];
      all = all.filter((a: any) => a.id !== f.id);
      this.editItemForm.controls.immagini.setValue(all);
    });
  }

}
