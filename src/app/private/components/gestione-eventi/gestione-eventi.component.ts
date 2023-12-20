import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { NgxUploadService, NgxUploadFile } from '@sinapsys/ngx-upload';
import * as moment from 'moment';
import { Subscription, Subject } from 'rxjs';
import { Evento } from 'src/app/models/evento.model';
import { EventiService } from 'src/app/public/services/eventi.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gestione-eventi',
  templateUrl: './gestione-eventi.component.html',
  styleUrls: ['./gestione-eventi.component.scss']
})
export class GestioneEventiComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  JSON = JSON;
  public Editor: any = ClassicEditor;
  ckEditorConfig: any = {
    placeholder: 'Inizia a scrivere...'
  };

  dataSource: MatTableDataSource<Evento> = new MatTableDataSource<Evento>();

  displayedColumns: string[] = ['id', 'titolo', 'testo', 'data', 'dettagli'];
  editItemForm!: FormGroup;
  editItem!: Evento;
  dialogRef!: MatDialogRef<any, any>;
  protected _onDestroy = new Subject<void>();

  imageUrl!: string;

  constructor(
    private eventiService: EventiService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private uploadService: NgxUploadService,
    private timelineService: TimelineService,
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.ckEditorConfig = {
      language: 'it',

    }
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      data_inizio: new FormControl(),
      data_fine: new FormControl(),
      titolo: new FormControl(),
      testo: new FormControl(),
    })
    this.editItemForm = new FormGroup({
      id: new FormControl(),
      data_inizio: new FormControl(),
      data_fine: new FormControl(),
      titolo: new FormControl(),
      testo: new FormControl(),
      immagini: new FormControl(),
      luogo: new FormControl(),
      costo: new FormControl(),
      orario: new FormControl(),
    })
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

    if(raw.titolo) raw.titolo = { $like: raw.titolo }
    else delete raw.titolo
    if(raw.testo) raw.testo = { $like: raw.testo }
    else delete raw.testo

    if(raw.data_inizio) raw.data_inizio = { $gte: raw.data_inizio.format('YYYY-MM-DD') }
    else delete raw.data_inizio
    if(raw.data_fine) raw.data_fine = { $lte: raw.data_fine.format('YYYY-MM-DD') }
    else delete raw.data_fine

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.eventiService.search(raw, pageRequest).subscribe(
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

  populateTable(result: PaginationResult<Evento>) {
    this.dataSource.data = result.items.map((item: any) => new Evento(item))
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  new() {
    this.edit(new Evento())
  }

  edit(item: Evento) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    this.dialogRef = this.dialog.open(this.detailsModal);
  }

  save() {
    let raw = this.editItemForm.getRawValue();
    // raw.testo = raw.testo.replace(/<p>/g, '<span>').replace(/<\/p>/g, '</span>');
    this.eventiService.save(raw).subscribe(res => {
      this.utilsService.notificationsService.success('Evento inserita correttamente');
      this.search(true);
      if (!raw.id) {
        this.timelineService.save({
          tipo_timeline: 'Arrivo',
          data: new Date(),
          descrizione: 'Arrivo Evento',
          id_Evento: res.id,
        } as any).subscribe(res => { })
      }
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

  delete() {
    let raw = this.editItemForm.getRawValue();
    this.eventiService.delete(raw.id).subscribe(res => {
      this.utilsService.notificationsService.success('Evento eliminata con successo');
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

  // editor


  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }



}
