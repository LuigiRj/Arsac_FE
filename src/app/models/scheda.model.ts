import { User } from "./shared/user.model";

export interface TipoScheda {
  tsk: string;
  des: string;
  ver: string;
  paragrafi: Paragrafo[];
}

export interface Paragrafo {
  acr: string
  def: string,
  obb: boolean,
  rip: boolean,
  lun: number,
  voc: "C" | undefined,
  vis: number
  sezioni: Sezione[]
}

export interface SezioneSemplice {
  acr: string
  def: string,
  obb: boolean,
  rip: boolean,
  lun: number,
  voc: "C" | undefined,
  vis: number,
  value: any
}

export interface Value {
  isObject: {},
  isValue: "",
}

export interface SezioneComplessa {
  acr: string,
  def: string,
  obb: boolean,
  rip: boolean,
  vis: number
  sezioni: SezioneSemplice[]
}

export type Sezione = SezioneSemplice | SezioneComplessa;

export class Scheda {
  constructor(record?: any) {
    Object.assign(this, record);
  }

  toString() {
    return `[${this.id}] ${this._source.__denominazione}`;
  }

  id?: string;
  _source!: {
    [key: string]: any,
    __tsk: string;
    __ver: string;
    __validated: boolean;
    __denominazione: string;
    __createdById: number,
    __salaId: number
  }
}
