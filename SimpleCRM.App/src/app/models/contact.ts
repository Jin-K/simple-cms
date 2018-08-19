import { IContact } from './interfaces';
import { Item }     from './item';

export class Contact extends Item implements IContact {
  static lastId = 0;
  lastName: string;
  firstName: string;

  constructor(lastName: string, firstName: string) {
    super();
    this.id = ++Contact.lastId;
    this.lastName = lastName;
    this.firstName = firstName;
  }
}
