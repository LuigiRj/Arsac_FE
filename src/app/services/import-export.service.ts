import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService extends NgxCrudService<any, any> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
  }

  export(id: number): any {
    return this.http.get(this._baseUrl + `export/` + id, { withCredentials: true, responseType: 'arraybuffer' })
  }

  import(formData: FormData): Observable<any> {
    return this.http.post<any>(this._baseUrl + 'import', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  exportReport(body: any): Observable<any> {
    return this.http.post(this._baseUrl + 'schede/_export', body, { withCredentials: true, responseType: 'arraybuffer' });
  }
}
