import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxCrudService } from "@sinapsys/ngx-crud";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../../models/shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends NgxCrudService<User, number> {
  constructor(
    protected http: HttpClient
  ) {
    super(http, {
      apiBaseUrl: environment.apiBaseUrl
    });
    this._baseUrl += 'settings/users/';
  }

  getAutocomplete(sq: string): Observable<User[]> {
    return this.search({ $or: { email: { $like: sq }, codiceFiscale: { $like: sq }, firstName: { $like: sq }, lastName: { $like: sq } } }).pipe(map(c => c.items.map(c => new User(c))));
  }
}
