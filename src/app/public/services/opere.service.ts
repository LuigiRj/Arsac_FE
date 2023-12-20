import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { Observable } from 'rxjs';
import { Timeline } from 'src/app/models/timeline.model';
import { environment } from 'src/environments/environment';
import { Scheda } from 'src/app/models/scheda.model';
import { Opera } from 'src/app/models/opera.model';

@Injectable({
  providedIn: 'root'
})
export class OpereService extends NgxCrudService<Opera, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: "http://localhost:3000/public/"
    });
    this._baseUrl += 'opere/';
  }

  getImmagini(id: number): any {
    return this.http.get<any>(`${this._baseUrl}${id}/immagini`)
  }

}
