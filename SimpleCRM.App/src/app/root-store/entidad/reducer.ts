import { Dictionary } from '@ngrx/entity/src/models';

import {
  EntidadesState,
  INITIAL_ENTIDADES_STATE,
  itemAdapter,
  ItemsState,
  entidadAdapter
}                     from './state';
import * as actions   from './actions';
import { IEntidad }   from '../../models/interfaces';

export function entityReducer(
  state: EntidadesState = INITIAL_ENTIDADES_STATE,
  action: actions.EntidadActions
): EntidadesState {
  let entities: Dictionary<ItemsState>;

  switch (action.type) {

    case actions.LOAD_ALL_COMPLETE:
      return _addEntidades(state, action.entidades);

    case actions.CREATE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.addOne(action.item, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case actions.UPDATE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.updateOne({
        id: action.id,
        changes: action.changes
      }, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case actions.DELETE:
      entities = Object.assign({}, state.entities);
      entities[action.entity] = itemAdapter.removeOne(action.id, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case actions.PAGINATE_SUCCESS:
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

function _addEntidades(state: EntidadesState, entidades: IEntidad[]): EntidadesState {
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

  return entidadAdapter.addMany(entidadesToAdd, newState);
}
