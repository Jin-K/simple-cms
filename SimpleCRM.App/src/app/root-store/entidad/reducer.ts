import {
  EntidadesState,
  INITIAL_ENTIDADES_STATE,
  itemAdapter,
  ItemsState
}                     from './state';
import * as actions   from './actions';
import { Dictionary } from '@ngrx/entity/src/models';


export function entityReducer(
  state: EntidadesState = INITIAL_ENTIDADES_STATE,
  action: actions.EntidadActions
) {
  const entities: Dictionary<ItemsState> = Object.assign({}, state.entities);

  switch (action.type) {

    case actions.CREATE:
      entities[action.entity] = itemAdapter.addOne(action.item, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case actions.UPDATE:
      entities[action.entity] = itemAdapter.updateOne({
        id: action.id,
        changes: action.changes
      }, state.entities[action.entity]);
      return Object.assign({}, state, { entities });

    case actions.DELETE:
      entities[action.entity] = itemAdapter.removeOne(action.id, state.entities[action.entity]);
      return Object.assign({}, state, { entities });


    default:
      return state;

  }
}
