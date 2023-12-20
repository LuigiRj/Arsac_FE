import { Model } from "@sinapsys/ngx-crud";

export class News extends Model {
  id_opera?: string;
  titolo!: string;
  testo!: string;
  autore?: string;
  immagini?: any;

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

