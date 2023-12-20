import { Model } from "@sinapsys/ngx-crud";

export class Evento extends Model {
  data_inizio!: Date
  data_fine!: Date;
  titolo!: string;
  testo!: string;
  immagini?: any;
  luogo?: string = '';
  costo?: string = '';
  orario?: string = '';

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

