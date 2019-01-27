import { IItem }                                                                                  from 'app/models';
import { INITIAL_ELEMENTS_STATE, INITIAL_ENTITY_STATE, ALL_ITEMS_SELECTED_STATE, entityAdapter }  from './initial-states';
import { IEntitySelection, ElementsState, IEntityState }                                          from './interfaces';
import { SelectionIdsStrategy, SelectionToggleItemAction, SelectionCode }                         from './enums';
import * as entityActions                                                                         from '../actions';

import * as _                                                                                     from 'lodash';

/**
 * Reducer for entities (state.elements)
 *
 * @export
 * @param {ElementsState} [state=INITIAL_ENTITIES_STATE] initial state.elements state before being reduced
 * @param {EntityActions} action action to reduce (or not if not related to entities)
 * @returns {ElementsState} reduced state.elements state
 */
export function entityReducer(state: ElementsState = INITIAL_ELEMENTS_STATE, action: entityActions.EntityActions): ElementsState {

  // get entity if action specified an entity name
  let entity: IEntityState;

  // if action requires that entity exists in store but it doesn't, return unchanged state
  switch (action.type) {

    case entityActions.CHANGE_FILTER:
    case entityActions.SORT:
    case entityActions.FETCH_ITEMS:
    case entityActions.PAGINATE_SUCCESS:
    case entityActions.TOGGLE_ONE:
    case entityActions.TOGGLE_RANGE:
    case entityActions.SELECT_ALL:
    case entityActions.DESELECT_ALL:
    case entityActions.TOGGLE_DISPLAYED_ITEMS:
      entity = action.entity ? state.entities[action.entity] : null;
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
      const newItemState = Object.assign({}, INITIAL_ENTITY_STATE, action.payload);

      // get new entity state using entityAdapter to add new item state
      const newState = entityAdapter.addOne(newItemState, state);

      // return newState with loading set to false
      return { ...newState, current: action.entity, loading: false };

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
        changes: {
          displayedItems: action.items,
          pagination: { ...entity.pagination, totalCount: action.totalCount }
        }
      }, state);

    /** CHANGE_ENTITY: Change current entity name */
    case entityActions.CHANGE_ENTITY:

      return { ...state, current: action.entity };

    /** TOGGLE_ONE: Select/deselect an item */
    case entityActions.TOGGLE_ONE:

      // return state with updated entity selection
      return entityAdapter.updateOne({
        id: entity.name,
        changes: getToggleSelectionChanges(entity, [action.itemId])
      }, state);

    /** SELECT_ALL: Select all items for an entity */
    case entityActions.SELECT_ALL:

      // return state with updated entity selection
      return entityAdapter.updateOne({
        id: entity.name,
        changes: {
          selection: ALL_ITEMS_SELECTED_STATE
        }
      }, state);

    /** DESELECT_ALL: Deselect all items for an entity */
    case entityActions.DESELECT_ALL:

      // return state with updated entity selection
      return entityAdapter.updateOne({
        id: entity.name,
        changes: {
          selection: INITIAL_ENTITY_STATE.selection
        }
      }, state);

    /** TOGGLE_DISPLAYED_ITEMS: Toggle selection for displayed items */
    case entityActions.TOGGLE_DISPLAYED_ITEMS:

      // get new entity state after toggle displayed items
      const selection = toggleDisplayedItemsAndGetNewEntitySelection(entity);

      // return state with updated entity selection
      return entityAdapter.updateOne({
        id: entity.name,
        changes: {
          selection
        }
      }, state);

    /** TOGGLE_RANGE: Toggle selection for specified items */
    case entityActions.TOGGLE_RANGE:

      // return state with updated entity selection
      return entityAdapter.updateOne({
        id: entity.name,
        changes: getToggleSelectionChanges(entity, action.itemIds)
      }, state);

    /** DEFAULT: not related to elements (entities - items) */
    default:

      // return unchanged state
      return state;

  }

}

function getToggleSelectionChanges(entity: IEntityState, itemIds: number[]): { selection: IEntitySelection } {

  // prepare changes object
  const changes = { selection: { ...entity.selection } as IEntitySelection };

  // get type of toggle we will handle
  const selectionType = getSelectionType(itemIds[0], entity.selection);

  // get changes for selection
  itemIds.forEach(itemId => changes.selection = buildSelection(entity, selectionType, itemId));

  return changes;

}

/**
 * Toggles (selection) for the current displayed items
 *
 * @param {IEntityState} entity entity name
 * @returns {IEntitySelection} new entity selection
 */
function toggleDisplayedItemsAndGetNewEntitySelection(entity: IEntityState): IEntitySelection {

  // prepare selection
  const newSelection = { ...entity.selection };
  const selectionCode = getSelectionCode(newSelection, entity.displayedItems, entity.pagination.totalCount);

  // determine if we should add or remove from set of ids
  let shouldAdd: boolean;
  switch (selectionCode) {
    case SelectionCode.A1:
    case SelectionCode.C3:
      shouldAdd = true;
      break;
    case SelectionCode.A2:
    case SelectionCode.A3:
      shouldAdd = newSelection.strategy === SelectionIdsStrategy.Inversed;
      break;
    case SelectionCode.B1:
    case SelectionCode.B2:
    case SelectionCode.B3:
    case SelectionCode.C1:
    case SelectionCode.C2:
      shouldAdd = newSelection.strategy === SelectionIdsStrategy.Normal;
      break;
  }

  // clone set or create new empty set if undefined
  newSelection.ids = newSelection.ids instanceof Set ? new Set<number>(newSelection.ids) : new Set<number>();

  // add or delete from set
  if (shouldAdd)  entity.displayedItems.forEach(item => newSelection.ids.add(item.id));
  else            entity.displayedItems.forEach(item => newSelection.ids.delete(item.id));

  // if ids set is full ==> change strategy
  if (newSelection.ids.size === entity.pagination.totalCount) {

    // swap strategy
    newSelection.strategy = newSelection.strategy === SelectionIdsStrategy.Normal ? SelectionIdsStrategy.Inversed : SelectionIdsStrategy.Normal;

    // clear ids set
    newSelection.ids.clear();
  }

  // undefine if empty
  if (newSelection.ids.size === 0) newSelection.ids = undefined;

  // return
  return newSelection;
}

/**
 * Determines the typy of selection we will have to perform
 *
 * @param {number} itemId id of the item
 * @param {IEntitySelection} selection current selection
 * @returns {SelectionToggleItemAction} returns a type of selection
 */
function getSelectionType(itemId: number, selection: IEntitySelection): SelectionToggleItemAction {

  const ids = selection.ids;

  // if normal ids collect strategy ==> adding / removing from selected items
  if (selection.strategy === SelectionIdsStrategy.Normal)
    return ids !== undefined && ids.has(itemId) ?
      SelectionToggleItemAction.RemoveSelected :
      SelectionToggleItemAction.AddSelected;

  // if inversed ids collect strategy ==> it means we have selected all items before
  return ids !== undefined && ids.has(itemId) ?
    SelectionToggleItemAction.RemoveUnselected :
    SelectionToggleItemAction.AddUnselected;

}


/**
 * Build new selection object after toggling one item
 *
 * @param {IEntityState} { selection, pagination } selection and pagination properties of the entity state
 * @param {SelectionToggleItemAction} selectionType type of selection
 * @param {number} itemId toggled item id
 * @returns {IEntitySelection} new state for the entity selection
 */
function buildSelection({ selection, pagination }: IEntityState, selectionType: SelectionToggleItemAction, itemId: number): IEntitySelection {

  // clone selection object
  const newSelection: IEntitySelection = {
    ids: selection.ids !== undefined ? _.clone(selection.ids) : new Set<number>(),
    strategy: selection.strategy
  };

  switch (selectionType) {

    case SelectionToggleItemAction.AddSelected:

      // push to ids set and swap strategy if all items are selected
      if (newSelection.ids.add(itemId).size === pagination.totalCount) {
        newSelection.ids = undefined;
        newSelection.strategy = SelectionIdsStrategy.Inversed;
      }

      return newSelection;

    case SelectionToggleItemAction.RemoveSelected:

      // remove from ids set and undefine ids set if nothing selected
      newSelection.ids.delete(itemId);
      if (newSelection.ids.size === 0) newSelection.ids = undefined;

      return newSelection;

    case SelectionToggleItemAction.AddUnselected:

      // push to ids set and swap strategy if all items are unselected
      if (newSelection.ids.add(itemId).size === pagination.totalCount) {
        newSelection.ids = undefined;
        newSelection.strategy = SelectionIdsStrategy.Normal;
      }

      return newSelection;

    case SelectionToggleItemAction.RemoveUnselected:

      // remove from ids set and undefine if nothing selected
      newSelection.ids.delete(itemId);
      if (newSelection.ids.size === 0) newSelection.ids = undefined;

      return newSelection;

    default: return newSelection;

  }

}

/**
 * Gets appropriate selection code (kind of state)
 *
 * ds = displayed selected items count,
 * dc = displayed items count,
 * ts = total selected items count,
 * tc = total items count
 *
 * @param {IEntitySelection} selection current entity selection state
 * @param {IItem[]} displayedItems current dispalyed items
 * @param {number} tc total count of items
 * @returns {SelectionCode} exact code describing the selection state
 */
function getSelectionCode(selection: IEntitySelection, displayedItems: IItem[], tc: number): SelectionCode {

  // displayed counter constant
  const dc = displayedItems.length;

  // prepare other counters to compute selection code
  let ds: number, ts: number;

  // if ids set exists ==> count
  if (selection.ids instanceof Set) {

    // if normal strategy, count displayed items included in selection.ids, otherwise ==> count displayed items not included in selection.ids
    ds = selection.strategy === SelectionIdsStrategy.Normal ?
      displayedItems.filter( item => selection.ids.has(item.id) ).length :
      displayedItems.filter( item => !selection.ids.has(item.id) ).length;

    // set total selection count to the size of the ids set
    ts = selection.ids.size;
  }
  // if ids set doesn't exists and normal strategy
  else if (selection.strategy === SelectionIdsStrategy.Normal) {

    // set displayed selected count and total selected count to 0
    ds = ts = 0;
  }
  // if ids set doesn't exists and inversed strategy
  else {

    // displayed selected count equals displayed count
    ds = dc;

    // total selected count equals total count
    ts = tc;
  }

  // 3 diff cases (check selection-states.md)
  switch (true) {
    // A1, A2, A3
    case ds === dc:
      if (ds === ts) return SelectionCode.A3;
      return ts === tc ? SelectionCode.A1 : SelectionCode.A2;
    // B1, B2, B3
    case ds > 0 && ds < dc:
      if (ds === ts) return SelectionCode.B3;
      return ts - ds + dc === tc ? SelectionCode.B1 : SelectionCode.B2;
    // C1, C2, C3
    case ds === 0:
      if (ts === 0) return SelectionCode.C3;
      return ts - ds + dc === tc ? SelectionCode.C1 : SelectionCode.C2;
  }

}
