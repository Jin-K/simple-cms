import { EntidadesState, entidadAdapter } from './state';
import { createFeatureSelector }          from '@ngrx/store';

// Create the default selectors
export const getEntidadesState = createFeatureSelector<EntidadesState>('entidad');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entidadAdapter.getSelectors(getEntidadesState);
