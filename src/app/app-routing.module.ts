import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InserisciSchedaComponent } from 'src/app/private/components/schede/inserisci-scheda/inserisci-scheda.component';
import { DashboardComponent } from './private/components/dashboard/dashboard.component';
import { GestioneEventiComponent } from './private/components/gestione-eventi/gestione-eventi.component';
import { GestioneNewsComponent } from './private/components/gestione-news/gestione-news.component';
import { GestioneOpereComponent } from './private/components/gestione-opere/gestione-opere.component';
import { MonitoraggioComponent } from './private/components/monitoraggio/monitoraggio.component';
import { ReportComponent } from './private/components/report/report.component';
import { SaleComponent } from './private/components/sale/sale.component';
import { RicercaSchedaComponent } from './private/components/schede/ricerca-scheda/ricerca-scheda.component';
import { VisualizzaComponent } from './private/components/schede/visualizza-scheda/visualizza-scheda.component';
import { RolesComponent } from './private/components/users/roles/roles.component';
import { UsersComponent } from './private/components/users/users/users.component';
import { EventoComponent } from './public/components/evento/evento.component';
import { HomepageComponent } from './public/components/homepage/homepage.component';
import { InformazioniComponent } from './public/components/informazioni/informazioni.component';
import { ListaEventiComponent } from './public/components/lista-eventi/lista-eventi.component';
import { ListaNewsComponent } from './public/components/lista-news/lista-news.component';
import { ListaOpereComponent } from './public/components/lista-opere/lista-opere.component';
import { MuseoComponent } from './public/components/museo/museo.component';
import { NewsComponent } from './public/components/news/news.component';
import { OperaComponent } from './public/components/opera/opera.component';
import { TimelineComponent } from './public/components/shared/timeline/timeline.component';
import { SplashComponent } from './public/components/splash/splash.component';
import { VirtualTourComponent } from './public/components/virtual-tour/virtual-tour.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StoriaComponent } from './public/components/storia/storia.component';
import { StoriaDetailsComponent } from './public/components/storia-details/storia-details.component';
import { PubblicazioniComponent } from './public/components/pubblicazioni/pubblicazioni.component';
import { PubblicazioneDetailsComponent } from './public/components/pubblicazione-details/pubblicazione-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
    data: { isPublic: true }
  },
  {
    path: 'public',
    data: { isPublic: true },
    children: [
      {
        path: '',
        component: HomepageComponent,
        data: { isPublic: true },
      },
      {
        path: 'informazioni',
        data: { isPublic: true },
        children: [
          {
            path: '',
            redirectTo: 'come-raggiungerci',
            pathMatch: 'full',
            data: { isPublic: true },
          },
          {
            path: 'come-raggiungerci',
            component: InformazioniComponent,
            data: { isPublic: true },
          },
          {
            path: 'orari-e-tariffe',
            component: InformazioniComponent,
            data: { isPublic: true },
          },
          {
            path: 'accessibilità',
            component: InformazioniComponent,
            data: { isPublic: true },
          },
          {
            path: 'contatti',
            component: InformazioniComponent,
            data: { isPublic: true },
          },
        ]
      },
      {
        path: 'museo',
        data: { isPublic: true },
        children: [
          {
            path: '',
            redirectTo: 'missione',
            pathMatch: 'full',
            data: { isPublic: true },
          },
          {
            path: 'missione',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'storia-e-sede',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'attività-espositiva',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'mediazione-e-didattica',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'staff',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'partner',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'carta-dei-servizi',
            component: MuseoComponent,
            data: { isPublic: true },
          },
          {
            path: 'cataloghi',
            component: MuseoComponent,
            data: { isPublic: true },
          },
        ]
      },
      {
        path: 'home',
        component: HomepageComponent,
        data: { isPublic: true },
      },
      {
        path: 'news',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: ListaNewsComponent,
            data: { isPublic: true },
          },
          {
            path: ':id',
            component: NewsComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'storia',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: StoriaComponent,
            data: { isPublic: true, type: 'storia' },
          },
          {
            path: ':id',
            component: StoriaDetailsComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'biblioteca',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: ListaNewsComponent,
            data: { isPublic: true, type: 'biblioteca' },
          },
          {
            path: ':id',
            component: NewsComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'bibliografia-e-pubblicazioni',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: PubblicazioniComponent,
            data: { isPublic: true, type: 'bib-publ' },
          },
          {
            path: ':id',
            component: PubblicazioneDetailsComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'archivio-storico',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: ListaNewsComponent,
            data: { isPublic: true, type: 'a-storico' },
          },
          {
            path: ':id',
            component: NewsComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'mostre',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: ListaEventiComponent,
            data: { isPublic: true },
          },
          {
            path: ':id',
            component: EventoComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'collezione',
        data: { isPublic: true },
        children: [
          {
            path: '',
            component: ListaOpereComponent,
            data: { isPublic: true },
          },

          {
            path: ':id',
            component: OperaComponent,
            data: { isPublic: true },
          }
        ]
      },
      {
        path: 'virtual-tour',
        component: VirtualTourComponent,
        data: { isPublic: true },
      },
    ],
  },

  {
    path: 'schede',
    canActivate: [AuthGuardService],
    data: { isPublic: false },
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'inserisci',
        component: InserisciSchedaComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'ricerca',
        component: RicercaSchedaComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'scheda/:id',
        component: InserisciSchedaComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'visualizza/:id',
        component: VisualizzaComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
    ],
  },
  {
    path: 'monitoraggio',
    canActivate: [AuthGuardService],
    data: { isPublic: false },
    children: [
      {
        path: '',
        component: MonitoraggioComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'timeline',
        component: TimelineComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'timeline/:id',
        component: TimelineComponent,
        canActivate: [AuthGuardService]
      },
    ]
  },
  {
    path: 'mappa',
    canActivate: [AuthGuardService],
    data: { isPublic: false },
    children: [
      {
        path: 'view',
        component: SaleComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
    ]
  },
  {
    path: 'settings',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'report',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: ReportComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'opere',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'gestione',
        component: GestioneOpereComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'gestione-news',
        component: GestioneNewsComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
      {
        path: 'gestione-eventi',
        component: GestioneEventiComponent,
        canActivate: [AuthGuardService],
        data: { isPublic: false },
      },
    ],
    data: { isPublic: false },
  },

  {
    path: '**',
    component: SplashComponent,
    pathMatch: 'full',
    data: { isPublic: true },
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
