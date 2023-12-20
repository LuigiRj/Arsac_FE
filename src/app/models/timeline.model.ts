import { Sala } from './sala.model';

import { Model } from '@sinapsys/ngx-crud';

export class Timeline extends Model {
  id_opera!: string;
  descrizione!: string;
  tipo_timeline!: string;
  from?: Sala;
  to?: Sala;
  data!: Date;
  stato_conservazione?: string
  tipologia_danno?: string
  origine_del_danno?: string
  operazioni_consigliate?: string

  constructor(record?: any) {
    super(record);
    record = record || {};
    this.to = record.to ? new Sala(record.to) : undefined;
  }
}
