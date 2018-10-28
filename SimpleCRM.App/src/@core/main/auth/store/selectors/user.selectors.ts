import { createSelector } from "@ngrx/store";

import { getAuthState }   from "../reducers";

import * as _             from 'lodash';

export const getUserState = createSelector(
  getAuthState,
  state => state.user
);

export const getUserIsAuthorized = createSelector(
  getUserState,
  state => state.authorized
)

export const getUserGivenName = createSelector(
  getUserState,
  state => state.given_name
)

export const getUserEmail = createSelector(
  getUserState,
  state => state.email
);

export const getUserRoles = createSelector(
  getUserState,
  state => state.roles
);

export const getUserHasAdminRole = createSelector(
  getUserRoles,
  roles => !!~_.indexOf(roles, 'admin')
);

export const getUserHasDataEventRecordsAdminRole = createSelector(
  getUserRoles,
  roles => !!~_.indexOf(roles, 'dataEventRecords.admin')
);
