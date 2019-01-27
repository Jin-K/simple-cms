import { Action }           from '@ngrx/store';
import { SortDirection }    from '@angular/material';
import { IItem }            from '../../../../models';
import { IEntityFilters }   from '../reducers';

export const LOAD_ENTITY                  = '[ENTITY].[LIST] LOAD_ENTITY';
export const LOAD_ENTITY_COMPLETE         = '[ENTITY].[LIST] LOAD_ENTITY_COMPLETE';
export const CHANGE_ENTITY                = '[ENTITY].[LIST] CHANGE_ENTITY';
export const CHANGE_FILTER                = '[ENTITY].[LIST] CHANGE_FILTER';
export const FETCH_ITEMS                  = '[ENTITY].[LIST] FETCH_ITEMS';
export const FETCH_ITEMS_FAILED           = '[ENTITY].[LIST] FETCH_ITEMS_FAILED';
export const TOGGLE_FAVORITE              = '[ENTITY].[LIST] TOGGLE_FAVORITE';
export const TOGGLE_FAVORITE_DONE         = '[ENTITY].[LIST] TOGGLE_FAVORITE_DONE';
export const TOGGLE_FAVORITE_FAILED       = '[ENTITY].[LIST] TOGGLE_FAVORITE_FAILED';
export const DELETE_ITEM                  = '[ENTITY].[LIST] DELETE_ITEM';
export const DELETE_ITEM_FAILED           = '[ENTITY].[LIST] DELETE_ITEM_FAILED';
export const DELETE_SELECTED_ITEMS        = '[ENTITY].[LIST] DELETE_SELECTED_ITEMS';
export const DELETE_SELECTED_ITEMS_FAILED = '[ENTITY].[LIST] DELETE_SELECTED_ITEMS_FAILED';

export const TOGGLE_ONE                   = '[ENTITY].[SELECTION] TOGGLE_ONE';
export const TOGGLE_RANGE                 = '[ENTITY].[SELECTION] TOGGLE_RANGE';
export const SELECT_ALL                   = '[ENTITY].[SELECTION] SELECT_ALL';
export const DESELECT_ALL                 = '[ENTITY].[SELECTION] DESELECT_ALL';
export const TOGGLE_DISPLAYED_ITEMS       = '[ENTITY].[SELECTION] TOGGLE_DISPLAYED_ITEMS';

export const CHANGE_ITEMS_COUNT           = '[ENTITY].[PAGINATION] CHANGE_ITEMS_COUNT';
export const SORT                         = '[ENTITY].[PAGINATION] SORT';
export const PAGINATE                     = '[ENTITY].[PAGINATION] PAGINATE';
export const PAGINATE_SUCCESS             = '[ENTITY].[PAGINATION] PAGINATE_SUCCESS';

export class LoadEntity implements Action {
  readonly type = LOAD_ENTITY;
  constructor(
    public readonly entity: string
  ) {}
}

export class LoadEntityComplete implements Action {
  readonly type = LOAD_ENTITY_COMPLETE;
  constructor(
    public readonly entity: string,
    public readonly payload: LoadEntityCompletePayload
  ) {}
}

export class ChangeEntity implements Action {
  readonly type = CHANGE_ENTITY;
  constructor(
    public readonly entity: string
  ) {}
}

export class ChangeFilter implements Action {
  readonly type = CHANGE_FILTER;
  constructor(
    public readonly entity: string,
    public readonly filters: IEntityFilters
  ) {}
}

export class FetchItems implements Action {
  readonly type = FETCH_ITEMS;
  constructor(
    public readonly entity: string,
    public readonly items: IItem[],
    public readonly totalCount: number
  ) {}
}

export class FetchItemsFailed implements Action {
  readonly type = FETCH_ITEMS_FAILED;
  constructor(
    public readonly entity: string,
    public readonly error: any
  ) {}
}

export class ToggleFavorite implements Action {
  readonly type = TOGGLE_FAVORITE;
  constructor(
    public readonly entity: string,
    public readonly itemId: number,
    public readonly add: boolean
  ) {}
}

export class ToggleFavoriteDone implements Action {
  readonly type = TOGGLE_FAVORITE_DONE;
  constructor(
    public readonly entity: string
  ) {}
}

export class ToggleFavoriteFailed implements Action {
  readonly type = TOGGLE_FAVORITE_FAILED;
  constructor(
    public readonly entity: string,
    public readonly error: any
  ) {}
}

export class DeleteItem implements Action {
  readonly type = DELETE_ITEM;
  constructor(
    public readonly entity: string,
    public readonly itemId: number
  ) {}
}

export class DeleteItemFailed implements Action {
  readonly type = DELETE_ITEM_FAILED;
  constructor(
    public readonly error: any
  ) {}
}

export class DeleteSelectedItems implements Action {
  readonly type = DELETE_SELECTED_ITEMS;
  constructor(
    public readonly entity: string
  ) {}
}

export class DeleteSelectedItemsFailed implements Action {
  readonly type = DELETE_SELECTED_ITEMS_FAILED;
  constructor(
    public readonly error: any
  ) {}
}

export class ToggleOne implements Action {
  readonly type = TOGGLE_ONE;
  constructor(
    public readonly entity: string,
    public readonly itemId: number
  ) {}
}

export class ToggleRange implements Action {
  readonly type = TOGGLE_RANGE;
  constructor(
    public readonly entity: string,
    public readonly itemIds: number[]
  ) {}
}

export class SelectAll implements Action {
  readonly type = SELECT_ALL;
  constructor(
    public readonly entity: string
  ) {}
}

export class DeselectAll implements Action {
  readonly type = DESELECT_ALL;
  constructor(
    public readonly entity: string
  ) {}
}

export class ToggleDisplayedItems implements Action {
  readonly type = TOGGLE_DISPLAYED_ITEMS;
  constructor(
    public readonly entity: string
  ) {}
}

export class Sort implements Action {
  readonly type = SORT;
  constructor(
    public readonly entity: string,
    public readonly column: string,
    public readonly direction: SortDirection
  ) {}
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
    public readonly entity: string,
    public readonly dataSlice: IItem[],
    public readonly totalCount: number
  ) { }
}

export interface LoadEntityCompletePayload {
  name: string;
  id: number;
  pagination: {
    page: number,
    pageCount: 5 | 10 | 25 | 100,
    orderBy: string,
    totalCount: number
  };
  filters: IEntityFilters;
}

export type EntityActions
  = LoadEntity
  | LoadEntityComplete
  | ChangeEntity
  | ChangeFilter
  | FetchItems
  | FetchItemsFailed
  | ToggleFavorite
  | ToggleFavoriteDone
  | ToggleFavoriteFailed
  | DeleteItem
  | DeleteItemFailed
  | DeleteSelectedItems
  | DeleteSelectedItemsFailed
  | ToggleOne
  | ToggleRange
  | SelectAll
  | DeselectAll
  | ToggleDisplayedItems
  | Sort
  | Paginate
  | PaginateSuccess;
