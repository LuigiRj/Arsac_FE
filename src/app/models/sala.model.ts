import { Model } from "@sinapsys/ngx-crud";
import { Piano } from "./piano.model";

export interface GeometriaSala {
  x: number;
  y: number;
  width: number;
  height: number;
  style: any;
}

export class Sala extends Model {

  nome!: string;
  piano!: Piano;
  svg!: GeometriaSala

  constructor(record?: any) {
    super(record);
    record = record || {};
  }

  toString() {
    return `${this.id} - ${this.nome}`
  }
}


