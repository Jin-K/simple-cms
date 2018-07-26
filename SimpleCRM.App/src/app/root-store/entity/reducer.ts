import { EntitiesState, INITIAL_ENTITIES_STATE, entityAdapter } from './state';
import * as actions                                             from './actions';


export function entityReducer(
  state: EntitiesState = INITIAL_ENTITIES_STATE,
  action: actions.EntityActions
) {
  switch (action.type) {

    case actions.CREATE:
      return entityAdapter.addOne(action.entity, state);

    case actions.UPDATE:
      return entityAdapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);

    case actions.DELETE:
      return entityAdapter.removeOne(action.id, state);

    default:
      return state;

  }
}
