import { Model } from "@sinapsys/ngx-crud";
import { Sala } from "./sala.model";

export class Piano extends Model {
  nome!: string;
  sale!: Sala[];
  viewBox!: string;

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

