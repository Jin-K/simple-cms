import * as actions                         from './entity.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector }            from '@ngrx/store';

// Main data interface
export interface Entity {
  id: string;
  name: string;
}

// Entity adapter
export const entityAdapter = createEntityAdapter<Entity>();
export interface State extends EntityState<Entity> { }

// Default data / initial state
const defaultEntity = {
  ids: ['123'],
  entities: {
    '123': {
      id: '123',
      name: 'small'
    }
  }
};

export const initialState: State = entityAdapter.getInitialState(defaultEntity);

export function entityReducer(
  state: State = initialState,
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

// Create the default selectors
export const getEntityState = createFeatureSelector<State>('entity');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entityAdapter.getSelectors(getEntityState);
