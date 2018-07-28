import { EntidadesState, entidadAdapter } from './state';
import { createFeatureSelector }          from '@ngrx/store';

// Create the default selectors
export const getEntidadesState = createFeatureSelector<EntidadesState>('entity');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entidadAdapter.getSelectors(getEntidadesState);
