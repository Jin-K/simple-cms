import { Dictionary, EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IEntidad, IItem } from '../../../../models';

import * as entityActions from '../actions';

// States
export interface ItemsState extends EntityState<IItem> {
  id: string;
  name: string;
  loaded: boolean;
  count?: number;
  displayedItems?: number[];
}
export interface EntitiesState extends EntityState<ItemsState> {
  loading: boolean;
  loaded: boolean;
  current?: string;
}

// Adapters
export const itemAdapter: EntityAdapter<IItem> = createEntityAdapter<IItem>();
export const entityAdapter: EntityAdapter<ItemsState> = createEntityAdapter<ItemsState>({
  selectId: entity => entity.name,
  sortComparer: false
});

// Initial States
export const INITIAL_ENTITIES_STATE: EntitiesState = entityAdapter.getInitialState({
  loading: false,
  loaded: false
});

// Reducer
export function entityReducer(
  state: EntitiesState = INITIAL_ENTITIES_STATE,
  action: entityActions.EntityActions
): EntitiesState {
  let entities: Dictionary<ItemsState>;

  switch (action.type) {

    case entityActions.LOAD_ALL_COMPLETE:
      return _addEntidades(state, action.entidades);

    case entityActions.CREATE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.addOne(action.item, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case entityActions.UPDATE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.updateOne({
        id: action.id,
        changes: action.changes
      }, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case entityActions.DELETE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.removeOne(action.id, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case entityActions.PAGINATE_SUCCESS:
      entities = Object.assign({}, state.entities);
      if (entities[action.entity]) {
        const displayedItems = action.dataSlice.map(item => item.id);
        entities[action.entity] = Object.assign({},
          itemAdapter.addMany(action.dataSlice, entities[action.entity]),
          { loaded: true, displayedItems, count: action.totalCount }
        );
      }
      return Object.assign({}, state, { entities, current: action.entity });

    default:
      return state;

  }
}

function _addEntidades(state: EntitiesState, entidades: IEntidad[]): EntitiesState {
  const ids = state.ids as string[];
  const entidadesToAdd: ItemsState[] = [];

  // TODO: memoize ?
  entidades.forEach(entidad => {
    if (ids.indexOf(entidad.Name) < 0) {
      const _entidad: ItemsState = {
        id: entidad.Id.toString(),
        name: entidad.Name,
        loaded: false,
        ids: [],
        entities: {}
      };
      entidadesToAdd.push(_entidad);
    }
  });

  const newState = Object.assign({}, state, { loaded: true });

  return entityAdapter.addMany(entidadesToAdd, newState);
}
