import { Model } from "@sinapsys/ngx-crud";
import { Piano } from "./piano.model";

export class Edificio extends Model {
  nome!: string;
  piani!: Piano[]

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

