import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { Evento } from 'src/app/models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventiService extends NgxCrudService<Evento, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: "http://localhost:3000/public/"
    });
    this._baseUrl += 'eventi/';
  }

  getImmagini(id: number): any {
    return this.http.get<any>(`${this._baseUrl}${id}/immagini`)
  }
}
