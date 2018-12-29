import { createFeatureSelector, createSelector }    from '@ngrx/store';
import { getUserGivenName }                         from '@core/auth';
import { entityAdapter, ElementsState }             from '../reducers';

import * as _                                       from 'lodash';

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

export const getCurrentDisplayedItems = createSelector(getCurrentEntity, entity => !entity ? undefined : entity.displayedItems);

export const getCurrentFilters = createSelector(getCurrentEntity, entity => !entity ? undefined : entity.filters);

export const getCurrentFiltersCategory = createSelector(getCurrentFilters, filters => filters.category);

export const getCurrentFiltersUser = createSelector(getCurrentFilters, filters => filters.user);

export const getCurrentDisplayName = createSelector(getUserGivenName, getCurrentFiltersUser, (userGivenName, filtersUser) => filtersUser ? filtersUser.displayName : userGivenName);
