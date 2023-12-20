import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUploadFile, NgxUploadService } from '@sinapsys/ngx-upload';
import { Scheda, TipoScheda } from 'src/app/models/scheda.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { AllegatiSchedaService } from 'src/app/services/schede/allegati-scheda.service';
import { SchedeService } from 'src/app/services/schede/schede.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AllegatoScheda } from './../../../../models/allegato-scheda.model';
import { ParagrafoComponent } from './../paragrafo/paragrafo.component';
import { LocalRandomService } from 'src/app/services/local-random.service';

@Component({
  selector: 'app-inserisci-scheda',
  templateUrl: './inserisci-scheda.component.html',
  styleUrls: ['./inserisci-scheda.component.scss']
})
export class InserisciSchedaComponent implements OnInit {
  @ViewChildren(ParagrafoComponent) children!: QueryList<ParagrafoComponent>;
  @ViewChild('detailsModal', { static: true }) detailsModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>

  public tipoSchedeDataSource: TipoScheda[] = [];
  public tipoSchedaCtrl: FormControl = new FormControl();
  public tipoScheda?: TipoScheda;
  scheda!: Scheda;
  nomeScheda: string = '';

  public allegati: AllegatoScheda[] = [];

  constructor(
    public utilsService: UtilsService,
    public route: ActivatedRoute,
    public schedeService: SchedeService,
    private _domSanitizer: DomSanitizer,
    private uploadService: NgxUploadService,
    private allegatiSchedaService: AllegatiSchedaService,
    private dialog: MatDialog,
    private importExportService: ImportExportService,
    private router: Router,
    private authService: AuthService,

    public localRandomService: LocalRandomService
  ) { }

  ngOnInit(): void {
    this.schedeService.getTipiScheda().subscribe((tipiScheda: TipoScheda[]) => {
      this.tipoSchedeDataSource = tipiScheda;
      if (!this.route.snapshot.params.id) return;
     // this.localRandomService.setUrlIdScheda(this.route.snapshot.params.id);
      this.schedeService.get(this.route.snapshot.params.id).subscribe((scheda: Scheda) => {
        let ts = this.tipoSchedeDataSource.find(tipoScheda => tipoScheda.tsk === scheda._source.__tsk && tipoScheda.ver === scheda._source.__ver);
        if (!ts) return;
        this.scheda = scheda;-
       // this.localRandomService.schedaRecIteration(this.scheda._source, this.route.snapshot.params.id)
        this.tipoSchedaCtrl.patchValue(ts);
        this.tipoSchedaCtrl.disable();
        this.setTipoScheda(ts);
        this.nomeScheda = scheda._source.__denominazione;
      });
      this.getImmagini();
    });
  }

  public getImmagini() {
    this.allegatiSchedaService.search({
      id_scheda: this.route.snapshot.params.id
    }).subscribe(async res => {
      const allegati = res.items.map(t => new AllegatoScheda(t));
      for (let a of allegati) {
        const b = await this.uploadService.download(a.allegato).toPromise();
        if (!b) continue;
        let data = new Blob([b], { type: a.allegato.contentType });
        let reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = () => {
          let url = URL.createObjectURL(data);
          a.url = this._domSanitizer.bypassSecurityTrustUrl(url);
          if (!this.allegati.find(t => t.id === a.id))
            this.allegati.push(a);
        }
      }
    });
  }

  setTipoScheda(ts: TipoScheda) {
    this.tipoScheda = ts;
   /* this.schedeService.loadVocabolari(ts.tsk).subscribe(res => {

      setTimeout(() => {
        this.patchValue(this.scheda?._source || ({ CD: { TSK: ts.tsk } } as any));
      }, 10);
    });*/
  }

  get value() {
    return this.children.map(child => child.value);
  }

  public patchValue(s: any) {
    return this.children.forEach(child => child.patchValue(s));
  }

  get valid() {
    return this.children.map(child => child.valid).reduce((a, e) => a && e, true);
  }

  save(validated?: boolean) {
    this.valid
    // if (!this.valid) {
    //   this.utilsService.notificationsService.error('Correggere gli errori prima di salvare');
    //   return;
    // }
    const raw: any = this.value.reduce((a, e) => ({ ...a, ...e }), {});
    raw.__tsk = this.tipoScheda?.tsk;
    raw.__ver = this.tipoScheda?.ver;
    raw.__validated = !!validated;
    raw.__denominazione = this.nomeScheda;
    if(!raw.id) raw.__createdById = this.authService.user?.id;
    this.schedeService.save({
      id: this.route.snapshot.params.id || undefined,
      _source: raw,
    }).subscribe(res => {
      this.utilsService.notificationsService.success('Scheda inserita correttamente');
      this.localRandomService.setUrlIdScheda('');
    }, err => {
      this.utilsService.defaultHttpErrorHandler(err);
    })
  }

  saveAndValidate() {
    if (!this.valid) {
      this.utilsService.notificationsService.error('Correggere gli errori prima di salvare');
      return;
    }
    this.save(true);
  }

  compareByTsk(a: TipoScheda, b: TipoScheda) {
    return a.tsk === b.tsk;
  }

  async handleUpload(files: NgxUploadFile[]) {
    for (let f of files) {
      let a = await this.allegatiSchedaService.save({
        id_scheda: this.route.snapshot.params.id,
        allegato: { id: f.id }
      } as any).toPromise();
      if (a) {
        this.getImmagini()
      }
    }
  }

  handleUploadError(error: string) {
    this.utilsService.notificationsService.error(error);
  }

  downloadFile(f: AllegatoScheda) {
    this.uploadService.download(f.allegato).subscribe(res => {
      this.utilsService.saveAs(res as any, f.allegato.originalFilename);
    })
  }

  deleteFile(f: AllegatoScheda) {
    this.uploadService.delete(f.allegato).subscribe(res => {
      this.allegatiSchedaService.delete(f.id).subscribe(res => {
        this.allegati = this.allegati.filter(a => a.id !== f.id);
      });
    });
  }

  async setPrincipale(f: AllegatoScheda) {
    for (let a of this.allegati) {
      if (a.id !== f.id && !a.principale) continue;
      a.principale = a.id === f.id;
      await this.allegatiSchedaService.save(a).toPromise();
    }
  }

  import() {
    this.dialogRef = this.dialog.open(this.detailsModal, {
      width: '30em',
    })
  }

  files: File[] = [];

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  importa() {
    const formData = new FormData();
    this.files.forEach(file => formData.append('file[]', file));
    this.importExportService.import(formData)
      .subscribe(res => {
        this.utilsService.notificationsService.success('Importazione completata');
        this.dialogRef.close();
        // go to ricerca-schede
        this.files = [];
        this.router.navigate(['/schede/ricerca']);
      }, err => {
        this.utilsService.notificationsService.error(err.error.message);
      })
  }
}
