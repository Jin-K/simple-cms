import { IAction }  from './interfaces';
import { Item }     from './item';

export class Action
  extends Item
  implements IAction {
  static lastId = 0;
  name: string;

  constructor(name: string) {
    super();
    this.id = ++Action.lastId;
    this.name = name;
  }
}
