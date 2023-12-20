import { SaleService } from 'src/app/services/sale.service';
import { Sala } from './../../../../models/sala.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxUploadFile, NgxUploadService } from '@sinapsys/ngx-upload';
import * as moment from 'moment';
import { debounceTime, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { Scheda } from 'src/app/models/scheda.model';
import { Timeline } from 'src/app/models/timeline.model';
import { AuthService } from 'src/app/services/auth.service';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { TimelineService } from 'src/app/services/schede/timeline.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  privato!: boolean;

  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;

  editItem!: FormGroup
  searchForm!: FormGroup
  timeline!: Timeline;

  operaSelected!: Scheda;

  events: Timeline[] = []
  tipiTimeline: string[] = [ 'Arrivo', 'Restauro', 'Spostamento', 'Furto', 'Restituzione', 'Uscita', 'Monitoraggio', 'Prestito', 'Altro']

  searchSubscription!: Subscription;

  schedeDataSource!: Observable<Scheda[]>;
  saleDataSource!: Observable<Sala[]>;

  constructor(
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private timelineService: TimelineService,
    private uploadService: NgxUploadService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private schedeService: SchedeService,
    private saleService: SaleService
  ) {
    if (!route.snapshot.params.id) return;
    this.schedeService.get(route.snapshot.params.id).subscribe(res => {
      this.operaSelected = new Scheda(res);
      this.searchForm.get('opera')?.setValue(this.operaSelected);
      this.search()
    });
  }

  async auth() {
    this.privato = await this.authService.can('opere:*:*') || await this.authService.can('monitoraggio:*:*')
  }

  initAutocomplete() {
    this.schedeDataSource = this.searchForm.controls.opera.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.schedeService.getAutocomplete(searchQuery);
        else return this.schedeDataSource;
      }));
    this.saleDataSource = this.editItem.controls.to.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.saleService.getAutocomplete(searchQuery);
        else return this.saleDataSource;
      }));

  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      opera: new FormControl(),
    })

    this.editItem = new FormGroup({
      id: new FormControl(),
      id_opera: new FormControl(),
      tipo_timeline: new FormControl(),
      descrizione: new FormControl(),
      data: new FormControl(),
      allegati: new FormControl(),
      from: new FormControl(),
      to: new FormControl(),
      stato_conservazione: new FormControl(),
      tipologia_danno: new FormControl(),
      origine_del_danno: new FormControl(),
      operazioni_consigliate: new FormControl(),
    })

    this.editItem.controls.tipo_timeline.valueChanges.subscribe(val => {
      if (val == 'Spostamento') {
        this.editItem.controls.to.setValidators([Validators.required])
      } else {
        this.editItem.controls.to.clearValidators()
      }
    })

    this.initAutocomplete()
    this.auth()
  }

  new() {
    this.edit(new Timeline())
  }

  edit(item: Timeline) {
    this.editItem.reset();
    this.timeline = item;
    this.editItem.patchValue(item);
    this.dialogRef = this.dialog.open(this.detailsModal, {
      minWidth: '50rem',
    });
  }

  addEvent() {
    let raw = this.editItem.getRawValue();
    raw.id_opera = this.operaSelected.id
    if (raw.to && raw.to.id != this.editItem.controls.to.value) {
      raw.from = this.editItem.controls.to.value
    }
    this.timelineService.save(raw).subscribe(res => {
      if(raw.to) this.editScheda(raw)
      this.search()
      this.sortEvent()
      this.utilsService.notificationsService.success('Timeline inserito correttamente');
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
    this.dialogRef.close();
  }

  editScheda(raw: any) {
    this.schedeService.save({
      id: raw.id_opera,
      _source: {
        __salaId: raw.to.id
      }
    } as any).subscribe(res => {  })
  }

  search() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }
    this.searchSubscription = this.timelineService.search({
      id_opera: this.operaSelected.id
    }).subscribe(res => {
      this.events = res.items.map(t => new Timeline(t))
      this.sortEvent()
    });
  }

  selected(event: any) {
    this.operaSelected = event.option.value;
    this.search()
  }

  save() {

  }

  sortEvent() {
    if (!this.events.length) return
    this.events.sort((a, b) => {
      if (a.tipo_timeline == 'Inizio') return 1
      if (b.tipo_timeline == 'Inizio') return -1
      return moment(a.data).isBefore(moment(b.data)) ? 1 : -1
    })

  }

  delete(id: number) {
    // if(window.confirm('Sei sicuro di voler eliminare questo timeline?'))
    this.timelineService.delete(id).subscribe(res => {
      this.utilsService.notificationsService.success('Timeline eliminato correttamente');
      this.search()
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    });
    this.dialogRef.close();
  }

  handleUpload(files: NgxUploadFile[]) {
    let allegati = this.editItem.controls.allegati.value || [];
    allegati.push(...files);
    this.editItem.controls.allegati.setValue(allegati);
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
      let all = this.editItem.controls.allegati.value || [];
      all = all.filter((a: any) => a.id !== f.id);
      this.editItem.controls.allegati.setValue(all);
    });
  }

  getNomeFile(f: NgxUploadFile) {
    if (!f) return
    let raw = this.editItem.getRawValue()
    return `${(raw.tipo_timeline).toUpperCase()} - ${moment(raw.data).format('DD-MM-Y')} - ${f.originalFilename.toUpperCase()}`;
  }

  get metadata() {
    let raw = this.editItem.getRawValue()
    if (!raw.tipo_timeline) return
    if (!raw.data) return
    return {
      title: `${(raw.tipo_timeline).toUpperCase()} - ${moment(raw.data).format('DD-MM-Y')}`
    }
  }
}
