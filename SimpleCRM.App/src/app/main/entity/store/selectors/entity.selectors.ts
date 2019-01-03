import { createFeatureSelector, createSelector }  from '@ngrx/store';
import { getUserGivenName }                       from '@core/auth';

import {
  entityAdapter,
  ElementsState,
  INITIAL_ENTITY_STATE,
  EntitySelection,
  SelectionIdsStrategy,
  EntityPagination
}                                                 from '../reducers';
import { IItem }                                  from 'app/models';

import * as _                                     from 'lodash';

export const getElementsState = createFeatureSelector<ElementsState>('elements');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entityAdapter.getSelectors(getElementsState);

export const getCurrentEntityName = createSelector(getElementsState, state => state.current);

export const getCurrentEntity = createSelector(selectEntities, getCurrentEntityName, (entities, current) => entities[current]);

export const getCurrentPagination = createSelector(getCurrentEntity, entity => !entity ? undefined : entity.pagination);

export const getCurrentSelection = createSelector(getCurrentEntity, entity => !entity ? INITIAL_ENTITY_STATE.selection : entity.selection);

export const getCurrentDisplayedItems = createSelector(getCurrentEntity, entity => !entity ? undefined : entity.displayedItems);

export const getCurrentFilters = createSelector(getCurrentEntity, entity => !entity ? undefined : entity.filters);

export const getCurrentFiltersCategory = createSelector(getCurrentFilters, filters => filters.category);

export const getCurrentFiltersUser = createSelector(getCurrentFilters, filters => filters.user);

export const getCurrentDisplayName = createSelector(getUserGivenName, getCurrentFiltersUser, (userGivenName, filtersUser) => filtersUser ? filtersUser.displayName : userGivenName);

export const getCurrentHasSelection = createSelector(getCurrentSelection, selection => !(selection.strategy === SelectionIdsStrategy.Normal && selection.ids === undefined));

export const getCurrentViewModelSelection = createSelector(getCurrentSelection, getCurrentDisplayedItems, selectionSetToViewModel);

export const getCurrentSelectionCounters = createSelector(getCurrentSelection, getCurrentPagination, selectionAndPaginationToSelectionCounters);

export const getCurrentPageSelectionCheckbox = createSelector(getCurrentDisplayedItems, getCurrentViewModelSelection, displayedItemsAndSelectionViewModelToCheckboxState);

function displayedItemsAndSelectionViewModelToCheckboxState(displayedItems: IItem[], viewModelSelection: {}) {

  let cpt = 0;

  for (const i in displayedItems)
    if (displayedItems.hasOwnProperty(i)
      && viewModelSelection.hasOwnProperty(displayedItems[i].id)
      && viewModelSelection[displayedItems[i].id]
    ) cpt++;

  switch (cpt) {
    case 0: return SelectionCheckboxState.None;
    case displayedItems.length: return SelectionCheckboxState.All;
    default: return SelectionCheckboxState.Indeterminate;
  }

}

function selectionAndPaginationToSelectionCounters(selection: EntitySelection, pagination: EntityPagination): SelectionCounter {

  const totalCount = pagination.totalCount;

  switch (true) {
    case selection.strategy === SelectionIdsStrategy.Inversed && selection.ids instanceof Set:
      return {
        selectionCount: totalCount - selection.ids.size,
        totalCount
      };
    case selection.strategy === SelectionIdsStrategy.Inversed && selection.ids === undefined:
      return {
        selectionCount: totalCount,
        totalCount
      };
    case selection.strategy === SelectionIdsStrategy.Normal && selection.ids instanceof Set:
      return {
        selectionCount: selection.ids.size,
        totalCount
      };
    case selection.strategy === SelectionIdsStrategy.Normal   && selection.ids === undefined:
    default:
      return {
        selectionCount: 0,
        totalCount
      };
  }

}

function selectionSetToViewModel(selection: EntitySelection, displayedItems: IItem[] = []): {} {

  const checkboxes = {};

  const ids = selection.ids;
  const strategy = selection.strategy;

  // syntax trick
  switch (true) {
    // if inversed selection ==> set checkbox false for each item that is included in ids set
    case strategy === SelectionIdsStrategy.Inversed && ids instanceof Set:
      displayedItems.forEach(item => checkboxes[item.id] = !ids.has(item.id));
      return checkboxes;
    // if normal selection ==> set checkbox true for each item that is included in ids set
    case strategy === SelectionIdsStrategy.Normal && ids instanceof Set:
      displayedItems.forEach(item => checkboxes[item.id] = ids.has(item.id));
      return checkboxes;
    // if all selected ==> set all checkboxes true
    case strategy === SelectionIdsStrategy.Inversed && ids === undefined:
      displayedItems.forEach(item => checkboxes[item.id] = true);
      return checkboxes;
    // if none selected ==> set all checkboxes false
    case strategy === SelectionIdsStrategy.Normal && ids === undefined:
    default:
      displayedItems.forEach(item => checkboxes[item.id] = false);
      return checkboxes;
  }

}

export interface SelectionCounter {
  selectionCount: number;
  totalCount: number;
}

export enum SelectionCheckboxState {
  None,
  All,
  Indeterminate
}
