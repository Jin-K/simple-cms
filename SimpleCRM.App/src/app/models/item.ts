import { IItem } from './interfaces';

export class Item implements IItem {
  active: boolean;
  created: Date;
  id: number;
  constructor() {
    this.created = new Date();
    this.id = -1;
    this.active = false;
  }
}
