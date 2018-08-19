import { Params }                                 from '@angular/router';
import { createFeatureSelector, createSelector }  from '@ngrx/store';
import { Dictionary }                             from '@ngrx/entity';

import {
  EntidadesState,
  entidadAdapter,
  ItemsState
}                                                 from './state';
import { IItem }                                  from '../../models/interfaces';
import { getUrlParams }                           from '../selectors';

export const getEntidadesState = createFeatureSelector<EntidadesState>('entidad');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entidadAdapter.getSelectors(getEntidadesState);

export const selectRouterEntidad = createSelector(getUrlParams, (params: Params) => params.entity as string);
export const selectIsLoaded = createSelector(getEntidadesState, (state: EntidadesState) => state.loaded);
export const selectCurrentItems = createSelector(selectEntities, selectRouterEntidad, getItems);
export const selectItemsIsLoaded = createSelector(selectEntities, selectRouterEntidad, getItemsIsLoaded);

function getItems(entities: Dictionary<ItemsState>, entidad: string): IItem[] {
  const items: IItem[] = [];
  const selected = entities[entidad];

  if (selected) {
    const entidadItems = selected.entities;
    for (const i in entidadItems) items.push(entidadItems[i]);
  }

  return items;
}

function getItemsIsLoaded(entities: Dictionary<ItemsState>, entidad: string): boolean {
  const selected = entities[entidad];
  return selected && selected.loaded;
}
