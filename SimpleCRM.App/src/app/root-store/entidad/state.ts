import { EntityState, createEntityAdapter, EntityAdapter }  from '@ngrx/entity';
import { Entidad }                                          from '../../models/entidad';

// Entity adapter
export const entidadAdapter: EntityAdapter<Entidad> = createEntityAdapter<Entidad>();
export interface EntidadesState extends EntityState<Entidad> { }

// Default data / initial state
const defaultEntidad = {
  ids: ['250'],
  entities: {
    '250': {
      id: '250',
      name: 'small'
    }
  }
};

export const INITIAL_ENTIDADES_STATE: EntidadesState = entidadAdapter.getInitialState(defaultEntidad);
