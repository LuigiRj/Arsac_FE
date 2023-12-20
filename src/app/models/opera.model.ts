import { Model } from "@sinapsys/ngx-crud";

export class Opera extends Model {
  id_opera!: string;
  titolo!: string;
  descrizione!: string;
  autore!: string;
  tipo!: string;
  immagini?: any;
  supporto?: string;
  dimensioni?: string;
  anno?: string;

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

