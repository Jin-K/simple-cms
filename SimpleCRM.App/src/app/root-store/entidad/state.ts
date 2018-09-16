import { EntityState, createEntityAdapter, EntityAdapter }  from '@ngrx/entity';
import { IItem }                                            from '../../models/interfaces';

// states
export interface ItemsState extends EntityState<IItem> {
  id: string;
  name: string;
  loaded: boolean;
  count?: number;
  displayedItems?: number[];
}
export interface EntidadesState extends EntityState<ItemsState> {
  loading: boolean;
  loaded: boolean;
  current?: string;
}

// adapters adapter
export const itemAdapter: EntityAdapter<IItem> = createEntityAdapter<IItem>();
export const entidadAdapter: EntityAdapter<ItemsState> = createEntityAdapter<ItemsState>({
  selectId: entidad => entidad.name,
  sortComparer: false
});

// Default data / initial state
export const INITIAL_ENTIDADES_STATE: EntidadesState = entidadAdapter.getInitialState({
  loading: false,
  loaded: false
} );
