import { Dictionary, EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IEntidad, IItem } from '../../../../models';

import * as entityActions from '../actions';

/**
 * The main ItemsState for state.entity.entities[] elements
 *
 * @export
 * @interface ItemsState
 * @extends {EntityState<IItem>}
 */
export interface ItemsState extends EntityState<IItem> {
  id: string;
  name: string;
  loaded: boolean;
  count?: number;
  displayedItems?: number[];
}

/**
 * The main EntitiesState interface for state.entity state (Entidad)
 *
 * @export
 * @interface EntitiesState
 * @extends {EntityState<ItemsState>}
 */
export interface EntitiesState extends EntityState<ItemsState> {
  loading: boolean;
  loaded: boolean;
  current?: string;
}

/**
 * Entity adapter for items.
 *
 * @constant
 * @type {EntityAdapter<IItem>}
 * */
export const itemAdapter: EntityAdapter<IItem> = createEntityAdapter<IItem>();

/**
 * Entity adapter for entities
 *
 * @constant
 * @type {EntityAdapter<ItemsState>}
 */
export const entityAdapter: EntityAdapter<ItemsState> = createEntityAdapter<ItemsState>({
  selectId: entity => entity.name,
  sortComparer: false
});

/**
 * Initial entities state (state.entity)
 *
 * @constant
 * @type {EntitiesState}
 */
export const INITIAL_ENTITIES_STATE: EntitiesState = entityAdapter.getInitialState({
  loading: false,
  loaded: false
});

/**
 * Reducer for entities
 *
 * @export
 * @param {EntitiesState} [state=INITIAL_ENTITIES_STATE] initial state.entity state before being reduced
 * @param {entityActions.EntityActions} action action to reduce (or not if not related to entities)
 * @returns {EntitiesState} reduced state.entity state
 */
export function entityReducer(
  state: EntitiesState = INITIAL_ENTITIES_STATE,
  action: entityActions.EntityActions
): EntitiesState {

  // check if it is an entity-related action
  switch (action.type) {

    // All main entities loaded
    case entityActions.LOAD_ALL_COMPLETE:
      return _addEntidades(state, action.entidades);

    // paginated with success
    case entityActions.PAGINATE_SUCCESS:

      // shallow copy of state.entities
      const entities = Object.assign({}, state.entities);

      // does the entity exist in store ?
      if (entities[action.entity]) {

        // collect ids of received data slice
        const displayedItems = action.dataSlice.map(item => item.id);

        // reference specific item of state.entity.entities to a new ItemsState state object created with itemAdapter.addMany
        entities[action.entity] = Object.assign({},

          // add chunk of items to ItemsState object (itemAdapter.addMany returns new sub-state)
          itemAdapter.addMany(action.dataSlice, entities[action.entity]),

          // apply new values
          { loaded: true, displayedItems, count: action.totalCount }
        );
      }

      // return deep copy of state.entity
      return Object.assign({}, state, { entities, current: action.entity });

    // not related to entities
    default:
      return state;

  }

}


/**
 * Adds entidades (entities) to the state.entity state
 *
 * @param {EntitiesState} state original state.entity state
 * @param {IEntidad[]} entidades array of received entidades (api response)
 * @returns {EntitiesState} new state.entity state
 */
function _addEntidades(state: EntitiesState, entidades: IEntidad[]): EntitiesState {

  // prepare constants
  const ids = state.ids as string[];
  const entidadesToAdd: ItemsState[] = [];

  // iterate over received entidades (TODO: memoize ?)
  entidades.forEach(entidad => {

    // if the name of the entidad exists in the state.entity's ids property
    // tslint:disable-next-line:no-bitwise
    if (!~ids.indexOf(entidad.name)) {

      // format and create ItemState object
      const _entidad: ItemsState = {
        id: entidad.id.toString(),
        name: entidad.name,
        loaded: false,
        ids: [],
        entities: {}
      };

      // push to array
      entidadesToAdd.push(_entidad);
    }
  });

  // create new state.entity object with deep copy
  const newState = Object.assign({}, state, { loaded: true });

  // return new state.entity state passing it to the entity adapter first
  return entityAdapter.addMany(entidadesToAdd, newState);
}
