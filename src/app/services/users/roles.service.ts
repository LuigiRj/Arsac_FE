import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxCrudService } from "@sinapsys/ngx-crud";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Role } from "src/app/models/shared/role.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RolesService extends NgxCrudService<Role, number> {
  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'settings/roles/';
  }

  getAutocomplete(sq: string): Observable<Role[]> {
    return this.search({ $or: { descrizione: { $like: sq } } }).pipe(map(c => c.items.map(c => new Role(c))));
  }
}
