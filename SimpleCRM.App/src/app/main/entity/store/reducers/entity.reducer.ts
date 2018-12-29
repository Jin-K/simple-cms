import { EntityState, createEntityAdapter, EntityAdapter }  from '@ngrx/entity';
import { IItem }                                            from 'app/models';
import * as entityActions                                   from '../actions';

/**
 * The main ElementsEntityState for state.elements.entities entries
 *
 * @export
 * @interface ElementsEntityState
 */
export interface ElementsEntityState {
  id: string;
  name: string;
  displayedItems?: IItem[];
  pagination?: any;
  filters?: entityActions.EntityListFilters;
}

/**
 * The main ElementsState interface for state.elements state (Entidad)
 *
 * @export
 * @interface ElementsState
 * @extends {EntityState<ElementsEntityState>}
 */
export interface ElementsState extends EntityState<ElementsEntityState> {
  loading: boolean;
  current?: string;
}

// Entity adapter for entities
export const entityAdapter: EntityAdapter<ElementsEntityState> = createEntityAdapter<ElementsEntityState>({
  selectId: entity => entity.name,
  sortComparer: false
});

// Initial entities state (state.elements)
export const INITIAL_ENTITIES_STATE: ElementsState = entityAdapter.getInitialState({
  loading: false
});

// Initial item state (state.elements.{entityName})
export const INITIAL_ITEM_STATE: ElementsEntityState = {
  id: null,
  name: null,
  filters: { category: 'all' as 'all' }
};

/**
 * Reducer for entities (state.elements)
 *
 * @export
 * @param {ElementsState} [state=INITIAL_ENTITIES_STATE] initial state.elements state before being reduced
 * @param {EntityActions} action action to reduce (or not if not related to entities)
 * @returns {ElementsState} reduced state.elements state
 */
export function entityReducer(state: ElementsState = INITIAL_ENTITIES_STATE, action: entityActions.EntityActions): ElementsState {

  // get entity if action specified an entity name
  const entity = action.entity ? state.entities[action.entity] : null;

  // if action requires that entity exists in store but it doesn't, return unchanged state
  switch (action.type) {

    case entityActions.CHANGE_FILTER:
    case entityActions.SORT:
    case entityActions.FETCH_ITEMS:
    case entityActions.PAGINATE_SUCCESS:
      if (!entity) return state;
      break;

  }

  // check if it is an entity-related action
  switch (action.type) {

    /** LOAD_ENTITY: prepare entity, query api for pagination and filter settings for a specific user */
    case entityActions.LOAD_ENTITY:

      // new state with loading = true
      return { ...state, loading: true };

    /** LOAD_ENTITY_COMPLETE: store pagination/filter settings */
    case entityActions.LOAD_ENTITY_COMPLETE:

      // shallow copy
      const newItemState = Object.assign({}, INITIAL_ITEM_STATE, action.payload);

      // get new entity state using entityAdapter to add new item state
      const newState = entityAdapter.addOne(newItemState, state);

      // return newState with loading set to false
      return {...newState, current: action.entity, loading: false};

    /** CHANGE_FILTER: change filter settings (category, user) */
    case entityActions.CHANGE_FILTER:

      // return state with updated entity list filters
      return entityAdapter.updateOne({
        id: entity.name,
        changes: { filters: action.filters }
      }, state);

    /** SORT: change orderBy/sort settings (column, direction) */
    case entityActions.SORT:

      // build orderBy string
      const orderBy = action.direction ? `${action.column} ${action.direction}` : action.column;

      // return state with updated entity pagination options
      return entityAdapter.updateOne({
        id: entity.name,
        changes: { pagination: { ...entity.pagination, orderBy }}
      }, state);

    /** FETCH_ITEMS: store items to display in pagination lists */
    case entityActions.FETCH_ITEMS:

      // return state with updated entity items
      return entityAdapter.updateOne({
        id: entity.name,
        changes: { displayedItems: action.items }
      }, state);

    /** CHANGE_ENTITY: Change current entity name */
    case entityActions.CHANGE_ENTITY:

      return { ...state, current: action.entity };

    // /** PAGINATE_SUCCESS: paginated with success */
    // case entityActions.PAGINATE_SUCCESS:

    //   // shallow copy of state.entities
    //   const entities = Object.assign({}, state.entities);

    //   // does the entity exist in store ?
    //   if (entities[action.entity]) {

    //     // collect ids of received data slice
    //     const displayedItems = action.dataSlice.map(item => item.id);

    //     // reference specific item of state.elements.entities to a new ElementsEntityState state object created with itemAdapter.addMany
    //     entities[action.entity] = Object.assign({},

    //       // add chunk of items to ElementsEntityState object (itemAdapter.addMany returns new sub-state)
    //       itemAdapter.addMany(action.dataSlice, entities[action.entity]),

    //       // apply new values
    //       { loaded: true, displayedItems, count: action.totalCount }
    //     );
    //   }

    //   // return deep copy of state.elements
    //   return Object.assign({}, state, { entities, current: action.entity });

    /** DEFAULT: not related to elements */
    default:
      return state;

  }

}
