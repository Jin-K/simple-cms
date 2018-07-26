import { EntitiesState, entityAdapter } from './state';
import { createFeatureSelector }        from '@ngrx/store';

// Create the default selectors
export const getEntitiesState = createFeatureSelector<EntitiesState>('entity');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = entityAdapter.getSelectors(getEntitiesState);
