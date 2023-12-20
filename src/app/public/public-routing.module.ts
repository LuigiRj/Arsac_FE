import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ListaOpereComponent } from './components/lista-opere/lista-opere.component';
import { SplashComponent } from './components/splash/splash.component';
import { ListaNewsComponent } from './components/lista-news/lista-news.component';

const routes: Routes = [
  { path: '', component: HomepageComponent , data : { isPublic: true } },
  { path: 'home', component: HomepageComponent, data : { isPublic: true }},
  { path: 'storia', component: ListaNewsComponent, data : { isPublic: true }},
  { path: 'eventi', component: HomepageComponent, data : { isPublic: true }},
  { path: 'opere', component: ListaOpereComponent, data: { isPublic: true }},
  { path: 'archivio-digitale', component: HomepageComponent, data: { isPublic: true }},
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
