import { EntidadesState, INITIAL_ENTIDADES_STATE, entidadAdapter } from './state';
import * as actions                                             from './actions';


export function entityReducer(
  state: EntidadesState = INITIAL_ENTIDADES_STATE,
  action: actions.EntidadActions
) {
  switch (action.type) {

    case actions.CREATE:
      return entidadAdapter.addOne(action.entity, state);

    case actions.UPDATE:
      return entidadAdapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);

    case actions.DELETE:
      return entidadAdapter.removeOne(action.id, state);

    default:
      return state;

  }
}
