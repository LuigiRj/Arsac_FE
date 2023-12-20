import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { catchError, filter, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Module, Navigation } from './models/shared/module-navigation.model';
import { AuthService } from './services/auth.service';
import { VersionService } from './services/version.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, AfterViewInit{
  @ViewChild('drawer', { static: false }) public drawer!: MatDrawer;

  public isPublic!: boolean;
  modules: Module[] = [];
  sidebarOpen: boolean = true;
  version: string = '';


  title = environment.appTitle;
  constructor(
    public authService: AuthService,
    private titleService: Title,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private versionService: VersionService,
    private notificationsService: NotificationsService
  ) {
    this.titleService.setTitle(this.title);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),

      )
      .subscribe((route: ActivatedRoute) => {
        this.isPublic = route.snapshot.data.isPublic;
      });
  }

  ngOnInit() {
    this.versionService.getVersion().pipe(catchError(res => of({ version: 'N/D' }))).subscribe((version: any) => {
      this.version = version.version;
    });
    let url: URL = new URL(location.href);
    let params = this.paramsToObject(url.searchParams);

    if (params['error']) {
      let errors: any = {
        '1': 'Si è verificato un errore durante il login',
        '2': 'Non sei autorizzato ad accedere a questa pagina'
      };
      let error: string = errors[params['error']] || 'Si è verificato un errore';
      this.notificationsService.error(error);
      history.replaceState({}, document.title, url.toString().split('?')[0]);
      return;
    }
    if (params['next']) {
      sessionStorage.setItem('login-redirect', params['next']);
    }
    if (params['token']) {
      this.authService.token = params['token'];
      history.replaceState({}, document.title, url.toString().split('?')[0]);
    }
    this.authService.authenticate().subscribe(me => {
      if (me && me.next) {
        this.router.navigateByUrl(me.next);
      }
    });
  }

  ngAfterViewInit() {
    let interval = setInterval(() => {
      this.modules = this.authService.modules;
      if (this.modules.length) clearInterval(interval);
    }, 100);
  }

  toggleClass(event: any, className: string) {
    event.preventDefault();
    event.stopPropagation();
    const isTarget = event.target.classList.contains('menu-module');
    if (!isTarget) return;
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(event.target, className);
    } else {
      this.renderer.addClass(event.target, className);
    }
  }

  authUrl() {
    return environment.authUrl;
  }

  isChildrenPath(module: Module) {
    return this.router.url.split('/').filter(a => !!a)[0] === module.id;
  }

  isCurrentPath(navigation: Navigation) {
    return this.router.url === navigation.url;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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

  private paramsToObject(entries: any): any {
    const result: any = {}
    for (const [key, value] of entries) {
      result[key] = value;
    }
    return result;
  }

}
