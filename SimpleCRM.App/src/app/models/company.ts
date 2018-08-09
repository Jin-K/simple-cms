import { ICompany } from './interfaces';
import { Item }     from './item';

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
