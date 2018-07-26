import { Action } from '@ngrx/store';
import { Entity } from '../../models/entity';

export const CREATE = '[Entities] Create';
export const UPDATE = '[Entities] Update';
export const DELETE = '[Entities] Delete';

export class Create implements Action {
  readonly type = CREATE;
  constructor(public entity: Entity) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(
    public id: string,
    public changes: Partial<Entity>
  ) { }
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

export type EntityActions
  = Create
  | Update
  | Delete;
