export class Navigation {
  id!: string;
  title!: string;
  url!: string;
  icon!: string;

  constructor(record?: any) {
    record = record || {};
    Object.assign(this, record);
  }
}

export class Module {
  id!: string;
  title!: string;
  url!: string;
  icon!: string;
  navigations!: Navigation[];

  constructor(record?: any) {
    record = record || {};
    Object.assign(this, record);
    this.navigations = record.navigations ? record.navigations.map((n: any) => new Navigation(n)) : [];
  }
}

export type Grant = string;