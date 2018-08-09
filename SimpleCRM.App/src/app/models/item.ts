import { IItem } from './interfaces';

export class Item implements IItem {
  active: boolean;
  dCreate: Date;
  id: number;
  constructor() {
    this.dCreate = new Date();
    this.id = -1;
    this.active = false;
  }
}
