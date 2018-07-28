import { Action }   from '@ngrx/store';
import { Entidad }  from '../../models/entidad';

export const CREATE = '[Entities] Create';
export const UPDATE = '[Entities] Update';
export const DELETE = '[Entities] Delete';

export class Create implements Action {
  readonly type = CREATE;
  constructor(public entity: Entidad) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(
    public id: string,
    public changes: Partial<Entidad>
  ) { }
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

export type EntidadActions
  = Create
  | Update
  | Delete;
