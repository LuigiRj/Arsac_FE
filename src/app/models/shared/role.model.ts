import { Model } from "@sinapsys/ngx-crud";
import { User } from "./user.model";

export class Role extends Model {
  public descrizione!: string;
  public grants!: string[];
  public users!: User[];

  createdAt!: Date;
  updatedAt!: Date;

  constructor(record?: any) {
    super(record);
    record = record || {};
    Object.assign(this, record);
    this.users = record.users ? record.users.map((u: any) => new User(u)) : [];
  }
}