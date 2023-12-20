import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageRequest, PaginationResult } from '@sinapsys/ngx-crud';
import { NgxUploadFile, NgxUploadService } from '@sinapsys/ngx-upload';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Scheda } from 'src/app/models/scheda.model';
import { Timeline } from 'src/app/models/timeline.model';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-monitoraggio',
  templateUrl: './monitoraggio.component.html',
  styleUrls: ['./monitoraggio.component.scss']
})
export class MonitoraggioComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;

  searchForm!: FormGroup;
  searchSubscription!: Subscription;

  id: string = '';

  JSON = JSON;

  dataSource: MatTableDataSource<Timeline> = new MatTableDataSource<Timeline>();

  displayedColumns: string[] = ['id', 'nome_opera', 'data', 'descrizione', 'dettagli'];
  editItemForm!: FormGroup;
  editItem!: Timeline;
  dialogRef!: MatDialogRef<any, any>;

  imageUrl!: string;
  selectedOption!: string;
  protected _onDestroy = new Subject<void>();

  schedeDataSource!: Observable<Scheda[]>;
  schedeDettaglioDataSource!: Observable<Scheda[]>;

  constructor(
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private uploadService: NgxUploadService,
    private timelineService: TimelineService,
    private schedeService: SchedeService
  ) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      id: new FormControl(),
      nome_opera: new FormControl(),
      data: new FormControl(),
      descrizione: new FormControl(),
    });
    this.editItemForm = new FormGroup({
      id: new FormControl(),
      nome_opera: new FormControl(),
      id_opera: new FormControl(),
      data: new FormControl(),
      descrizione: new FormControl(),
      allegati: new FormControl(),
      stato_conservazione: new FormControl(),
      tipologia_danno: new FormControl(),
      origine_del_danno: new FormControl(),
      operazioni_consigliate: new FormControl(),
    });

    this.initAutocomplete();
  }

  selected(event: any) {
    const selectedOption = event.option.value;
    const selectedOptionLabel = event.option.viewValue;
    this.editItemForm.controls.nome_opera.setValue(selectedOptionLabel);
    this.editItemForm.controls.id_opera.setValue(selectedOption.id);
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
    this.schedeDataSource = this.searchForm.controls.nome_opera.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.schedeService.getAutocomplete(searchQuery);
        else return this.schedeDataSource;
      }));
    this.schedeDettaglioDataSource = this.editItemForm.controls.nome_opera.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.schedeService.getAutocomplete(searchQuery);
        else return this.schedeDettaglioDataSource;
      }));
  }

  search(keepPage?: boolean) {
    if (!keepPage) this.paginator.pageIndex = 0

    let raw = this.searchForm.getRawValue();

    if (raw.nome_opera) raw.id_opera = raw.nome_opera.id
    delete raw.nome_opera;

    if (raw.descrizione) raw.descrizione = { $like: raw.descrizione }
    else delete raw.descrizione

    if (raw.data) raw.data = raw.data.format('YYYY-MM-DD')

    let sortProperty: string = this.sort.active
    let pageRequest: PageRequest = new PageRequest(this.paginator.pageIndex, this.paginator.pageSize, this.sort.direction, sortProperty)

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.timelineService.search(raw, pageRequest).subscribe(
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

  populateTable(result: PaginationResult<Timeline>) {
    this.dataSource.data = result.items.filter((item: Timeline) => item.tipo_timeline === 'Monitoraggio')
    let interval = setInterval(() => {
      if (this.paginator) {
        this.paginator.length = result.total
        clearInterval(interval)
      }
    }, 200)
  }

  new() {
    this.edit(new Timeline())
  }

  edit(item: Timeline) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    this.dialogRef = this.dialog.open(this.detailsModal);
  }

  save() {
    let raw = this.editItemForm.getRawValue();
    raw.tipo_timeline = 'Monitoraggio';
    if (!raw.nome_opera?.id) {
      this.utilsService.notificationsService.error('Selezionare un\'opera');
      return;
    }
    raw.id_opera = raw.nome_opera.id;
    delete raw.nome_opera;
    this.timelineService.save(raw).subscribe(res => {
      this.utilsService.notificationsService.success('Timeline inserita correttamente');
      this.search(true);
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
  }

  delete() {
    let raw = this.editItemForm.getRawValue();
    this.timelineService.delete(raw.id).subscribe(res => {
      this.utilsService.notificationsService.success('Timeline eliminata con successo');
      this.search(true);
      this.dialogRef.close();
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.editItemForm.patchValue({ image: file });
    this.editItemForm.controls.allegati.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  handleUpload(files: NgxUploadFile[]) {
    let allegati = this.editItemForm.controls.allegati.value || [];
    allegati.push(...files);
    this.editItemForm.controls.allegati.setValue(allegati);
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
      let all = this.editItemForm.controls.allegati.value || [];
      all = all.filter((a: any) => a.id !== f.id);
      this.editItemForm.controls.allegati.setValue(all);
    });
  }

  exportPDF(item: Timeline) {
    this.editItemForm.reset();
    this.editItemForm.patchValue(item);
    this.editItem = item;
    let form = this.editItemForm.controls;
    let dd = {
      content: [
        {
          alignment: 'right',
          columns: [
            {
              image: 'stemma',
              width: '100%',
              fit: [200, 200],
            },
          ],
        },
        '\n',
        {
          alignment: 'right',
          text: 'via Sebastiano Satta 27 - 08100 Nuoro',
        },
        {
          alignment: 'right',
          text: 'T. +39.0784.252110',
          style: 'underline',
        },
        {
          alignment: 'right',
          text: 'F. +39.0784.36243',
          style: 'bold',
        },
        {
          alignment: 'right',
          text: 'info@museoman.it',
          style: 'bold',
        },
        '\n\n\n',
        {
          text: `Data: ${moment(form['data'].value).format('DD/MM/YYYY')}`,
          style: 'bold',
          alignment: 'right'
        },
        '\n',
        {
          text: 'SCHEDA DI MONITORAGGIO',
          style: 'header',
        },
        '\n',
        {
          text: `Scheda relativa: ${form['nome_opera'].value}, Identificativo: ${form['id_opera'].value}`,
          style: 'bold'
        },
        '\n',
        '\n',
        '\n',
        {
          text: `Stato di conservazione: ${form['stato_conservazione'].value}`
        },
        '\n',
        {
          text: `Tipologia del danno: ${form['tipologia_danno'].value ?? 'Nessun danno rilevato'} `
        },
        '\n',
        {
          text: `Origine del danno: ${form['origine_del_danno'].value ?? 'Nessun danno rilevato'} `
        },
        '\n',
        {
          text: `Operazioni consigliate: ${form['operazioni_consigliate'].value ?? 'Nessuna operazione da consigliare'} `
        },
        '\n',
        {
          text: `Descrizione e note aggiuntive: ${form['descrizione'].value ?? ''}`
        },
        '\n',

      ],
      images: {
        stemma:
          'data:image/png;base64,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',
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
        subHead: {
          fontSize: 16,
          bold: true,
        },
        bold: {
          bold: true,
          lineHeight: 1.1,
        },
        subHeader: {
          italics: true,
          fontSize: 11,
          lineHeight: 1.1,
        },
        underline: {
          decoration: 'underline',
          bold: true,
          fontSize: 11,
          lineHeight: 1.2,
        },
        justify: {
          alignment: 'justify'
        }
      },
    };

    pdfMake.createPdf(dd as any).open();
  }

}
