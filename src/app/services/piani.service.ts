import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { environment } from 'src/environments/environment';
import { Sala } from '../models/sala.model';

@Injectable({
  providedIn: 'root'
})
export class PianiService extends NgxCrudService<Sala, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'piani/';
  }
}
