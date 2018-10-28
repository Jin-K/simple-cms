import { createSelector } from "@ngrx/store";

import { getAuthState }   from "../reducers";

export const getSessionState = createSelector(
  getAuthState,
  state => state.session
);

export const getSessionStarted = createSelector(
  getSessionState,
  state => state.started
);

export const getSessionToken = createSelector(
  getSessionState,
  state => state.token
);
