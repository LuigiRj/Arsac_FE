import { Model } from "@sinapsys/ngx-crud";

export class Monitoraggio extends Model {
  opera!: string;
  data!: Date;
  note!: Text;
  allegati?: any;
  luogo?: string = '';

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

