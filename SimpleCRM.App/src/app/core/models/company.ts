import { Item }     from './item';
import { ICompany } from './interfaces';

export class Company
  extends Item
  implements ICompany {
  static lastId = 0;
  name: string;

  constructor(name: string) {
    super();
    this.id = ++Company.lastId;
    this.name = name;
  }
}
