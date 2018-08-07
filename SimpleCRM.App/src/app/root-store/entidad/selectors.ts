import { createFeatureSelector, createSelector }  from '@ngrx/store';

import { EntidadesState, entidadAdapter }         from './state';
import { ApplicationState }                       from '../reducers/application-state';
import { IItem }                                  from '../../models/interfaces';

// Create the default selectors
export const getEntidadesState = createFeatureSelector<EntidadesState>('entidad');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entidadAdapter.getSelectors(getEntidadesState);

export const selectIsLoaded = (state: ApplicationState) => state.entidad == null ? undefined : state.entidad.loaded;
export const selectCurrentRouterEntidad = (state: ApplicationState) => state.router === undefined ? '' : state.router.state.params.entity as string;

export const selectCurrentItems = createSelector(
  selectEntities,
  selectCurrentRouterEntidad,
  (entities, currentEntidad) => {
    const items: IItem[] = [];
    const selected = entities[ currentEntidad ];
    if (selected) {
      const entidadItems = selected.entities;
      for (const i in entidadItems) items.push( entidadItems[ i ] );
    }
    return items;
  }
);

