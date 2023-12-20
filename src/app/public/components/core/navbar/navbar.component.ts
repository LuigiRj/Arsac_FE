import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/services/auth.service';
import { VersionService } from 'src/app/services/version.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  admin!: boolean;
  monitoraggio!: boolean;
  schedatore!: boolean;
  direzione!: boolean;

  //navigations: string[] = ['informazioni', 'museo', 'mostre','collezione', 'news', 'virtual-tour',];
 // navigations: string[] = ['Home', 'Storia', 'Archivio ST.','Biblioteca', 'Bibliografia',];

  navigations: any[] = [
    {
      'nome': 'Home',
      'link': 'home',
      'content':[]
    },
    {
      'nome': 'Storia',
      'link': 'storia',
      'content':['Enti-prodnti','Enti-consen.','archivio']
    },
    {
      'nome': 'Archivio storico',
      'link': 'archivio-storico',
      'content':['Inventario','Fascicoli','Immagini']
    },
    {
      'nome': 'Biblioteca',
      'link': 'biblioteca',
      'content':['Catalogo','Unità','Immagini']
    },
    {
      'nome': 'Bibliografia e pubblicazioni',
      'link': 'bibliografia-e-pubblicazioni',
      'content':['Autori-Anno']
    }
  ]


  /*obj = this.navigations.content.map(str => ({
    lbl: str,
    url: str.replace(/\s+/g, '-').toLowerCase()
  }));*/

  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private titleService: Title,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private versionService: VersionService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.auth();
  }

  async auth() {
    this.admin = await this.authService.can('*:*:*')
    this.monitoraggio = await this.authService.can('monitoraggio:*:*')
    this.schedatore = await this.authService.can('schede:*:*')
    this.direzione = await this.authService.can('direzione:*:*')
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  authUrl() {
    return environment.authUrl;
  }

  isHome() {
    return this.router.url === '/schede';
  }

  isLogged() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  openMyMenu(menuTrigger: MatMenuTrigger) {
      menuTrigger.openMenu();
  }

  closeMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
}

}
