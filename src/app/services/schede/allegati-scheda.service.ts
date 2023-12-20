import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { environment } from 'src/environments/environment';
import { AllegatoScheda } from './../../models/allegato-scheda.model';

@Injectable({
  providedIn: 'root'
})
export class AllegatiSchedaService extends NgxCrudService<AllegatoScheda, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl,
    });
    this._baseUrl += 'allegati-scheda/';
  }
}
