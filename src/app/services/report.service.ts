import { NgxCrudService } from '@sinapsys/ngx-crud';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends NgxCrudService<any, any> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'schede/_report/';
  }

  report(raw?: any): Observable<any> {
    return this.http.post<any>(this._baseUrl, raw, { withCredentials: true, responseType: 'json' });
  }
}
