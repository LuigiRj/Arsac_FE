import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sala } from '../models/sala.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends NgxCrudService<Sala, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'sale/';
  }

  getAutocomplete(sq: string): Observable<Sala[]> {
    return this.search({ nome: { $like: sq } }).pipe(map(c => c.items.map(c => new Sala(c))));
  }


}
