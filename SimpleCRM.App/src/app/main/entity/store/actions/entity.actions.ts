import { Action }           from '@ngrx/store';
import { IEntidad, IItem }  from '../../../../models';

export const LOAD_ALL                 = '[Entidad] LOAD_ALL';
export const LOAD_ALL_COMPLETE        = '[Entidad] LOAD_ALL_COMPLETE';

export const CREATE                   = '[Entities] CREATE';
export const UPDATE                   = '[Entities] UPDATE';
export const DELETE                   = '[Entities] DELETE';

export const PAGINATE                 = '[Entidad] PAGINATE';
export const PAGINATE_SUCCESS         = '[Entidad] PAGINATE_SUCCESS';

export class LoadAll implements Action {
  readonly type = LOAD_ALL;
  constructor() { }
}

export class LoadAllComplete implements Action {
  readonly type = LOAD_ALL_COMPLETE;
  constructor(public entidades: IEntidad[]) { }
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

export class Paginate implements Action {
  readonly type = PAGINATE;
  constructor(
    public entity: string
  ) { }
}

export class PaginateSuccess implements Action {
  readonly type = PAGINATE_SUCCESS;
  constructor(
    public entity: string,
    public dataSlice: IItem[],
    public totalCount: number
  ) { }
}

export type EntityActions
  = LoadAll
  | LoadAllComplete
  | Create
  | Update
  | Delete
  | Paginate
  | PaginateSuccess;
