import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUploadModule } from '@sinapsys/ngx-upload';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { PublicRoutingModule } from './public-routing.module';
import { PubblicazioniComponent } from './components/pubblicazioni/pubblicazioni.component';
import { PubblicazioniCardComponent } from './components/pubblicazioni-card/pubblicazioni-card.component';
import { StoriaDetailsComponent } from './components/storia-details/storia-details.component';
import { PubblicazioneDetailsComponent } from './components/pubblicazione-details/pubblicazione-details.component';


// import { InserisciOperaComponent } from './components/inserisci-opera/inserisci-opera.component';



@NgModule({
  declarations: [

  ],
  imports: [

  CommonModule,
    PublicRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
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
    MatChipsModule,
    NgxUploadModule.forRoot({
      mediaBaseUrl: environment.apiBaseUrl + 'media/'}),
  ],
  bootstrap: [AppComponent]
})
export class PublicModule { }
