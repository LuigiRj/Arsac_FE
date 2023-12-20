import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxCrudModule } from '@sinapsys/ngx-crud';
import { NgxUploadModule } from '@sinapsys/ngx-upload';
import { SimpleNotificationsModule } from 'angular2-notifications';
import 'hammerjs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSelectSearchOptions, MAT_SELECTSEARCH_DEFAULT_OPTIONS, NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ConfirmDialogComponent } from 'src/app/private/components/shared/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from 'src/app/private/components/shared/prompt-dialog/prompt-dialog.component';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './private/components/dashboard/dashboard.component';
import { GestioneEventiComponent } from './private/components/gestione-eventi/gestione-eventi.component';
import { GestioneNewsComponent } from './private/components/gestione-news/gestione-news.component';
import { GestioneOpereComponent } from './private/components/gestione-opere/gestione-opere.component';
import { MonitoraggioComponent } from './private/components/monitoraggio/monitoraggio.component';
import { ReportComponent } from './private/components/report/report.component';
import { SaleComponent } from './private/components/sale/sale.component';
import { InserisciSchedaComponent } from './private/components/schede/inserisci-scheda/inserisci-scheda.component';
import { ParagrafoChildComponent } from './private/components/schede/paragrafo-child/paragrafo-child.component';
import { ParagrafoComponent } from './private/components/schede/paragrafo/paragrafo.component';
import { RicercaSchedaComponent } from './private/components/schede/ricerca-scheda/ricerca-scheda.component';
import { SezioneChildComponent } from './private/components/schede/sezione-child/sezione-child.component';
import { SezioneComponent } from './private/components/schede/sezione/sezione.component';
import { ParagrafiChildComponent } from './private/components/schede/visualizza-scheda/paragrafi-child/paragrafi-child.component';
import { ParagrafiComponent } from './private/components/schede/visualizza-scheda/paragrafi/paragrafi.component';
import { SezioneComplessaChildComponent } from './private/components/schede/visualizza-scheda/sezione-complessa-child/sezione-complessa-child.component';
import { SezioneComplessaComponent } from './private/components/schede/visualizza-scheda/sezione-complessa/sezione-complessa.component';
import { VisualizzaComponent } from './private/components/schede/visualizza-scheda/visualizza-scheda.component';
import { RolesComponent } from './private/components/users/roles/roles.component';
import { UsersComponent } from './private/components/users/users/users.component';
import { FooterComponent } from './public/components/core/footer/footer.component';
import { NavbarComponent } from './public/components/core/navbar/navbar.component';
import { EventoComponent } from './public/components/evento/evento.component';
import { HomepageComponent } from './public/components/homepage/homepage.component';
import { InformazioniComponent } from './public/components/informazioni/informazioni.component';
import { ListaEventiComponent } from './public/components/lista-eventi/lista-eventi.component';
import { ListaNewsComponent } from './public/components/lista-news/lista-news.component';
import { ListaOpereComponent } from './public/components/lista-opere/lista-opere.component';
import { MuseoComponent } from './public/components/museo/museo.component';
import { NewsComponent } from './public/components/news/news.component';
import { OperaComponent } from './public/components/opera/opera.component';
import { BreadcrumbsComponent } from './public/components/shared/breadcrumbs/breadcrumbs.component';
import { CardEventoComponent } from './public/components/shared/card-evento/card-evento.component';
import { CardNewsComponent } from './public/components/shared/card-news/card-news.component';
import { CardOperaComponent } from './public/components/shared/card-opera/card-opera.component';
import { CarouselComponent } from './public/components/shared/carousel/carousel.component';
import { TimelineComponent } from './public/components/shared/timeline/timeline.component';
import { SplashComponent } from './public/components/splash/splash.component';
import { VirtualTourComponent } from './public/components/virtual-tour/virtual-tour.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { StoriaComponent } from './public/components/storia/storia.component';
import { PubblicazioniComponent } from './public/components/pubblicazioni/pubblicazioni.component';
import { PubblicazioniCardComponent } from './public/components/pubblicazioni-card/pubblicazioni-card.component';
import { StoriaDetailsComponent } from './public/components/storia-details/storia-details.component';
import { PubblicazioneDetailsComponent } from './public/components/pubblicazione-details/pubblicazione-details.component';
//import { LocalRandomService } from './services/local-random.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UsersComponent,
    RolesComponent,
    PromptDialogComponent,
    ConfirmDialogComponent,
    InserisciSchedaComponent,
    ParagrafoComponent,
    RicercaSchedaComponent,
    SezioneComponent,
    ParagrafoChildComponent,
    SezioneChildComponent,
    VisualizzaComponent,
    ParagrafiComponent,
    SezioneComplessaComponent,
    SezioneComplessaChildComponent,
    ParagrafiChildComponent,
    NavbarComponent,
    SplashComponent,
    HomepageComponent,
    OperaComponent,
    TimelineComponent,
    ListaOpereComponent,
    BreadcrumbsComponent,
    GestioneOpereComponent,
    FooterComponent,
    CardOperaComponent,
    GestioneNewsComponent,
    ListaNewsComponent,
    StoriaComponent,
    StoriaDetailsComponent,
    PubblicazioniCardComponent,
    PubblicazioniComponent,
    PubblicazioneDetailsComponent,
    NewsComponent,
    CardNewsComponent,
    GestioneEventiComponent,
    ListaEventiComponent,
    EventoComponent,
    CardEventoComponent,
    CarouselComponent,
    InformazioniComponent,
    MuseoComponent,
    MonitoraggioComponent,
    SaleComponent,
    VirtualTourComponent,
    ReportComponent,


  ],
  imports: [
    NgxCrudModule,
    CarouselModule,
    NgxDropzoneModule,
    RouterModule,
    BrowserModule,
    MatGridListModule,
    CKEditorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    FormsModule,
    FlexLayoutModule,
    MatSortModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    CdkTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatChipsModule,
    CommonModule,
    NgxUploadModule.forRoot({
      mediaBaseUrl: environment.apiBaseUrl + 'media/'}),
    CdkAccordionModule,
    SimpleNotificationsModule.forRoot({
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true
    }),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: LOCALE_ID, useValue: "it-IT" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: MAT_SELECTSEARCH_DEFAULT_OPTIONS,
      useValue: <MatSelectSearchOptions>{
        placeholderLabel: 'Cerca...',
        noEntriesFoundLabel: 'Nessun elemento corrispondente',
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
