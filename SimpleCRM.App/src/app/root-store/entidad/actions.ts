import { Action }           from '@ngrx/store';
import { IItem, IEntidad }  from '../../models/interfaces';

export const LOAD_ALL_ITEMS           = '[Entidad] LOAD_ALL_ITEMS';
export const LOAD_ALL_ITEMS_COMPLETE  = '[Entidad] LOAD_ALL_ITEMS_COMPLETE';

export const LOAD_ALL                 = '[Entidad] LOAD_ALL';
export const LOAD_ALL_COMPLETE        = '[Entidad] LOAD_ALL_COMPLETE';

export const CREATE                   = '[Entities] CREATE';
export const UPDATE                   = '[Entities] UPDATE';
export const DELETE                   = '[Entities] DELETE';

export class LoadAll implements Action {
  readonly type = LOAD_ALL;
  constructor() { }
}

export class LoadAllComplete implements Action {
  readonly type = LOAD_ALL_COMPLETE;
  constructor(public entidades: IEntidad[]) { }
}

export class LoadAllItems implements Action {
  readonly type = LOAD_ALL_ITEMS;
  constructor(public entity: string) { }
}

export class LoadAllItemsComplete implements Action {
  readonly type = LOAD_ALL_ITEMS_COMPLETE;
  constructor(public entity: string, public items: IItem[]) { }
}

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

export type EntidadActions
  = LoadAll
  | LoadAllComplete
  | LoadAllItems
  | LoadAllItemsComplete
  | Create
  | Update
  | Delete;
