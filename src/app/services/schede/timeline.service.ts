import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxCrudService } from '@sinapsys/ngx-crud';
import { Timeline } from 'src/app/models/timeline.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimelineService extends NgxCrudService<Timeline, number> {

  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl,
    });
    this._baseUrl += 'events/';
  }
}
