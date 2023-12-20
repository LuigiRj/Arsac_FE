import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Grant, Module } from 'src/app/models/shared/module-navigation.model';
import { Role } from 'src/app/models/shared/role.model';
import { User } from 'src/app/models/shared/user.model';
import { environment } from 'src/environments/environment';

export interface MenuItem {
  url: string;
  label: string;
  icon: string;
  comingSoon?: boolean;
}

export interface AuthResponse {
  status: string;
  user: User;
  grants: string[];
  modules: Module[];
  next?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl;
  private _token?: string;
  private _user?: User;
  private _grants?: string[];
  private _modules?: Module[];

  public get token() {
    return this._token || sessionStorage.getItem('auth-token') || '';
  }

  public set token(token: string) {
    sessionStorage.setItem('auth-token', token);
    this._token = token;
  }

  public get user(): User | undefined {
    if (this._user) return this._user;
    return undefined;
  }

  public get grants(): string[] {
    if (this._grants) return this._grants;
    return [];
  }

  public get modules(): Module[] {
    if (this._modules) return this._modules;
    return [];
  }

  constructor(
    private http: HttpClient
  ) {
    this._baseUrl = environment.authUrl;
  }

  private getMe(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(this._baseUrl + 'me', { withCredentials: true, responseType: 'json' }).pipe(map(res => {
      let lr = sessionStorage.getItem('login-redirect');
      if (lr) {
        res.next = lr;
        sessionStorage.removeItem('login-redirect');
      }
      return res;
    }));
  }

  isAuthenticated(): boolean {
    return this.token !== '';
  }

  authenticate(): Observable<AuthResponse | null> {
    if (!this.token) {
      return of(null);
    }

    return this.getMe()
      .pipe(catchError(() => {
        sessionStorage.removeItem('auth-token');
        this._token = undefined;
        return of(null);
      }))
      .pipe(map(me => {
        if (me === null) return null;
        this._user = new User(me.user);
        this._grants = me.grants;
        this._modules = me.modules;
        return me;
      }));
  }

  can(s: Grant): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.token) return resolve(false);
      if (!this._user) {
        let interval = setInterval(() => {
          if (this._user) {
            clearInterval(interval);
            resolve(this.can(s));
          }
          if (!this._token) {
            clearInterval(interval);
            resolve(false);
          }
        }, 100);
        return;
      }
      const [m, n, g] = s.split(':');
      let grants: string[] = Array.from(new Set(this._user.roles.reduce((a: string[], r: Role) => [...a, ...r.grants], [])));
      if (n === '*') {
        let ms = grants.map(g => g.split(':')[0]);
        if (ms.indexOf(m) > -1) return resolve(true);
      }
      if (g === '*') {
        let mn = grants.map(g => [g.split(':')[0], g.split(':')[1]].join(':'));
        if (mn.indexOf([m, n].join(':')) > -1) return resolve(true);
      }
      if (grants.indexOf(`*:*:*`) > -1) return resolve(true);
      if (grants.indexOf(`${m}:*:*`) > -1) return resolve(true);
      if (grants.indexOf(`${m}:${n}:*`) > - 1) return resolve(true);
      if (grants.indexOf(s) > -1) return resolve(true);
      return resolve(false);
    });
  }

  setLoginRedirect(url: string): void {
    sessionStorage.setItem('login-redirect', url);
  }

  getAllGrants(): Observable<Grant[]> {
    return this.http.get<Grant[]>(this._baseUrl + 'grants');
  }

  logout() {
    sessionStorage.clear();
    window.location.href = '/';
  }
}
