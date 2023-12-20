import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(
    private utilsService: UtilsService
  ) {
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
  }

  checkLoading() {
    if (this.requests.length > 0) {
      this.utilsService.showLoading();
    } else {
      this.utilsService.hideLoading();
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('X-Skip-Loading')) {
      return new Observable(observer => {
        const subscription = next.handle(req).subscribe(event => {
          if (event instanceof HttpResponse) {
            observer.next(event);
          }
        });
        return () => { }
      });
    }

    this.requests.push(req);
    this.checkLoading();

    return new Observable(observer => {
      const subscription = next.handle(req).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            this.checkLoading();
            observer.next(event);
          }
        },
        err => {
          this.removeRequest(req);
          this.checkLoading();
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          this.checkLoading();
          observer.complete();
        }
      );
      return () => {
        this.removeRequest(req);
        this.checkLoading();
        subscription.unsubscribe();
      };
    });
  }
}