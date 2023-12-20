import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Module, Navigation } from 'src/app/models/shared/module-navigation.model';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  modules: Module[] | Navigation[] = [];
  curModule?: Module;

  constructor(
    public utilsService: UtilsService,
    public authService: AuthService,
    private router: Router
  ) {
  }

  private _interval: any;

  ngOnInit(): void {
    this._interval = setInterval(() => {
      this.modules = this.getModules();
      if (this.modules.length > 0) clearInterval(this._interval);
    }, 200);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  authUrl() {
    return environment.authUrl;
  }

  getModules(): Module[] | Navigation[] {
    this.curModule = undefined;
    const modules: Module[] = this.authService.modules;
    let curUrl = this.router.url.substring(1);
    if (!curUrl) return modules;
    let curModule = modules.find(m => m.id === curUrl);
    if (curModule) {
      this.curModule = curModule;
      return curModule.navigations;
    }
    return [];
  }

  title() {
    if (!this.authService.isAuthenticated())
      return 'Accesso richiesto';
    if (!this.modules || !this.modules.length)
      return 'Si è verificato un errore';
    if (this.curModule)
      return this.curModule.title;
    return environment.appTitle;
  }
}
