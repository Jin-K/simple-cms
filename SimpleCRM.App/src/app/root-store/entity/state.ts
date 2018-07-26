import { EntityState, createEntityAdapter, EntityAdapter }  from '@ngrx/entity';
import { Entity }                                           from '../../models/entity';

// Entity adapter
export const entityAdapter: EntityAdapter<Entity> = createEntityAdapter<Entity>();
export interface EntitiesState extends EntityState<Entity> { }

// Default data / initial state
const defaultEntity = {
  ids: ['250'],
  entities: {
    '250': {
      id: '250',
      name: 'small'
    }
  }
};

export const INITIAL_ENTITIES_STATE: EntitiesState = entityAdapter.getInitialState(defaultEntity);
