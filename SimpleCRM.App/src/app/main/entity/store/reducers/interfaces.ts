import { EntityState }          from '@ngrx/entity';
import { IItem }                from 'app/models';
import { SelectionIdsStrategy } from './enums';


/**
 * The main ElementsState interface for state.elements state (Entidad)
 *
 * @export
 * @interface ElementsState
 * @extends {EntityState<IEntityState>}
 */
export interface ElementsState extends EntityState<IEntityState> {
  loading: boolean;
  current?: string;
}

/**
 * The main IEntityState for state.elements.entities entries
 *
 * @export
 * @interface IEntityState
 */
export interface IEntityState {
  id: string;
  name: string;
  displayedItems?: IItem[];
  pagination?: IEntityPagination;
  filters: IEntityFilters;
  selection: IEntitySelection;
}

/**
 * The main IEntityPagination interface for state.elements.entities[].pagination
 *
 * @export
 * @interface IEntityPagination
 */
export interface IEntityPagination {
  page: number;
  pageCount: number;
  orderBy: string;
  totalCount: number;
}

/**
 * The main IEntityFilters interface for state.elements.entities[].filters
 *
 * @export
 * @interface IEntityFilters
 */
export interface IEntityFilters {
  category: 'all' | 'favorite';
  user?: {
    id: number,
    displayName?: string
  };
}

/**
 * The main IEntitySelection interface for state.elements.entities[].selection
 *
 * @export
 * @interface IEntitySelection
 */
export interface IEntitySelection {
  ids?: Set<number> | undefined;
  strategy: SelectionIdsStrategy;
}
