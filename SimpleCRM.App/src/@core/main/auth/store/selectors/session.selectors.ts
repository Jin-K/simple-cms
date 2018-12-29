import { createSelector } from '@ngrx/store';
import { getAuthState }   from '../reducers';

export const getSessionState = createSelector(
  getAuthState,
  state => state.session
);

export const getSessionLoaded = createSelector(
  getSessionState,
  state => state.loaded
);

export const getSessionStarted = createSelector(
  getSessionState,
  state => state.started
);
