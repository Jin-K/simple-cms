import { Action }   from '@ngrx/store';
import { IItem }    from '../../models/interfaces';

export const CREATE = '[Entities] Create';
export const UPDATE = '[Entities] Update';
export const DELETE = '[Entities] Delete';

export class Create implements Action {
  readonly type = CREATE;
  constructor(
    public item: IItem,
    public entity: string
  ) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(
    public id: number,
    public entity: string,
    public changes: Partial<IItem>
  ) { }
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(
    public id: number,
    public entity: string
  ) { }
}

export type EntidadActions = Create | Update | Delete;
