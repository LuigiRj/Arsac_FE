import { ImportExportService } from './../../../../services/import-export.service';
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxUploadService } from '@sinapsys/ngx-upload';
import { OwlOptions } from "ngx-owl-carousel-o";
import { AllegatoScheda } from "src/app/models/allegato-scheda.model";

import { DomSanitizer } from '@angular/platform-browser';
import { Scheda, TipoScheda } from "src/app/models/scheda.model";
import { AllegatiSchedaService } from "src/app/services/schede/allegati-scheda.service";
import { SchedeService } from "src/app/services/schede/schede.service";
import { UtilsService } from "src/app/services/utils.service";
import { ParagrafiComponent } from "./paragrafi/paragrafi.component";
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: "app-visualizza",
  templateUrl: "./visualizza-scheda.component.html",
  styleUrls: ["./visualizza-scheda.component.scss"],
})
export class VisualizzaComponent implements OnInit {

  window = window;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    items: 1,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  }

  direzione!: boolean;
  admin!: boolean;
  schedatore!: boolean;
  private!: boolean;

  @ViewChildren(ParagrafiComponent) children!: QueryList<ParagrafiComponent>;

  public tipoSchedeDataSource: TipoScheda[] = [];
  public tipoScheda?: TipoScheda;
  scheda!: Scheda;
  public allegati: AllegatoScheda[] = [];
  scroll: number = 0;
  createdBy!: string ;
  updatedBy: string = "";

  tsk: string = "";
  ver: string = "";
  user: string = "";
  validata: boolean = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.scroll = window.pageYOffset;
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  constructor(
    private route: ActivatedRoute,
    private schedeService: SchedeService,
    public utilsService: UtilsService,
    private allegatiSchedaService: AllegatiSchedaService,
    private uploadService: NgxUploadService,
    private _domSanitizer: DomSanitizer,
    private importExportService: ImportExportService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.schedeService.getTipiScheda().subscribe((tipiScheda: TipoScheda[]) => {
      this.tipoSchedeDataSource = tipiScheda;
      if (!this.route.snapshot.params.id) return;
      this.schedeService
        .get(this.route.snapshot.params.id)
        .subscribe((scheda: Scheda) => {
          let ts = this.tipoSchedeDataSource.find(tipoScheda => tipoScheda.tsk === scheda._source.__tsk && tipoScheda.ver === scheda._source.__ver);
          if (!ts) return;
          this.scheda = scheda;
          this.tsk = ts.tsk
          this.ver = ts.ver
          this.user = this.authService.user?.firstName + ' ' + this.authService.user?.lastName
          if(scheda._source.__createdById) this.usersService.get(scheda._source.__createdById).subscribe(res => {this.createdBy = res.firstName + ' ' + res.lastName})
          this.setTipoScheda(ts);
          this.validata = scheda._source.__validated;
        });
    });

    this.allegatiSchedaService.search({
      id_scheda: this.route.snapshot.params.id
    }).subscribe(async res => {
      const allegati = res.items.map(t => new AllegatoScheda(t));
      for(let a of allegati) {
        const b = await this.uploadService.download(a.allegato).toPromise();
        if(!b) continue;
        let data = new Blob([b], { type: a.allegato.contentType });
        let reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = () => {
          let url = URL.createObjectURL(data);
          a.url = this._domSanitizer.bypassSecurityTrustUrl(url);
          this.allegati.push(a);
        }
      }
    });

    this.auth()
  }

  async auth() {
    this.admin = await this.authService.can('*:*:*')
    this.direzione = await this.authService.can('report:*:*')
    this.private = await this.authService.can('schede:visibilita:privato')
  }

  setTipoScheda(ts: TipoScheda) {
    this.schedeService.loadVocabolari(ts.tsk).subscribe(res => {
      this.tipoScheda = ts;
      setTimeout(() => {
        this.patchValue(this.scheda?._source || ({ CD: { TSK: ts.tsk } } as any));
      }, 10);
    });
  }

  isObject(o: any) {
    return o !== null && typeof o === "object";
  }

  isArray(o: any) {
    return Array.isArray(o);
  }

  public patchValue(s: any) {
    return this.children.forEach((child) => child.patchValue(s));
  }

  export() {
    this.importExportService.export(this.route.snapshot.params.id).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      this.utilsService.download(`${this.tsk}_${this.ver}_${ this.user}_${moment().format('DDMMY')}.zip`, url)
    });
  }
}

