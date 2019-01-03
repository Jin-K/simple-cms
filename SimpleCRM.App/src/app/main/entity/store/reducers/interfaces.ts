import { EntityState }          from '@ngrx/entity';
import { IItem }                from 'app/models';
import { SelectionIdsStrategy } from './enums';


/**
 * The main ElementsState interface for state.elements state (Entidad)
 *
 * @export
 * @interface ElementsState
 * @extends {EntityState<ElementsEntityState>}
 */
export interface ElementsState extends EntityState<ElementsEntityState> {
  loading: boolean;
  current?: string;
}

/**
 * The main ElementsEntityState for state.elements.entities entries
 *
 * @export
 * @interface ElementsEntityState
 */
export interface ElementsEntityState {
  id: string;
  name: string;
  displayedItems?: IItem[];
  pagination?: EntityPagination;
  filters: EntityFilters;
  selection: EntitySelection;
}

/**
 * The main EntityPagination interface for state.elements.entities[].pagination
 *
 * @export
 * @interface EntityPagination
 */
export interface EntityPagination {
  page: number;
  pageCount: number;
  orderBy: string;
  totalCount: number;
}

/**
 * The main EntityFilters interface for state.elements.entities[].filters
 *
 * @export
 * @interface EntityFilters
 */
export interface EntityFilters {
  category: 'all' | 'favorite';
  user?: {
    id: number,
    displayName?: string
  };
}

/**
 * The main EntitySelection interface for state.elements.entities[].selection
 *
 * @export
 * @interface EntitySelection
 */
export interface EntitySelection {
  ids?: Set<number> | undefined;
  strategy: SelectionIdsStrategy;
}
