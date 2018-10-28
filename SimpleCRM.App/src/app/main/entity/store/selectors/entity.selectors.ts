import { createFeatureSelector, createSelector }    from '@ngrx/store';
import { Dictionary }                               from '@ngrx/entity';
import { PaginationItemList }                       from '@core/pagination';

import { entityAdapter, ItemsState, EntitiesState } from '../reducers';
import { IItem }                                    from 'app/models';

import * as _                                       from 'lodash';

const getEntidadesState = createFeatureSelector<EntitiesState>('entity');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entityAdapter.getSelectors(getEntidadesState);

const selectCurrentEntity = createSelector(getEntidadesState, state => state.current);
export const selectCurrentItems = createSelector(selectEntities, selectCurrentEntity, getPaginationItems);

function getPaginationItems(entities: Dictionary<ItemsState>, current: string): PaginationItemList<IItem> {
  const entity = entities[current];
  if (entity === undefined) return { Items: [], Count: 0 };
  const ids = entity.displayedItems;
  const dataSlice = _.map(ids, id => _.find(entity.entities, item => item.id === id));

  return {
    Items: dataSlice,
    Count: entity.count
  };
}
