import { createFeatureSelector, createSelector }  from '@ngrx/store';
import { Dictionary }                             from '@ngrx/entity';

import {
  EntidadesState,
  entidadAdapter,
  ItemsState
}                                                 from './state';
import { PaginationItemList }                     from '../../core/modules/pagination';
import { IItem }                                  from '../../core/models';

import * as _                                     from 'lodash';

const getEntidadesState = createFeatureSelector<EntidadesState>('entidad');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entidadAdapter.getSelectors(getEntidadesState);

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
