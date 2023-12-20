import { SafeUrl } from "@angular/platform-browser";
import { Model } from "@sinapsys/ngx-crud";
import { NgxUploadFile } from '@sinapsys/ngx-upload';

export class AllegatoScheda extends Model {
  id_scheda!: string;
  allegato!: NgxUploadFile;
  principale!: boolean;

  url!: SafeUrl;

  get alt() {
    return this.allegato.originalFilename;
  }

  get title() {
    return this.allegato.originalFilename;
  }

  constructor(record?: any) {
    super(record);
    record = record || {};
  }
}

