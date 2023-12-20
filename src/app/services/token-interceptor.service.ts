import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers;
    if (request.headers.get('Content-Type') !== 'multipart/form-data') {
      headers = headers.set('Content-Type', 'application/json');
    }
    else
      headers = headers.delete('Content-Type');
    if (this.authService.isAuthenticated()) {
      headers = headers.set('x-auth-token', this.authService.token);
    }

    return next.handle(request.clone({
      headers
    }));
  }
}