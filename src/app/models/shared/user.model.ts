import { Model } from "@sinapsys/ngx-crud";
import { Role } from "./role.model";

export class User extends Model {
  firstName!: string;
  lastName!: string;
  email!: string;
  tel?: string;
  codiceFiscale!: string;
  matricola!: string;
  attivo: boolean = true;
  roles: Role[];
  grants!: string[];

  constructor(record?: any) {
    super(record);
    record = record || {};
    this.roles = record.roles ? record.roles.map((r: any) => new Role(r)) : [];
    this.grants = record.grants || [];
  }

  toString() {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }
}
