import { Action } from "@ngrx/store";

export const AUTHORIZATION_DONE = '[AUTH].[USER] AUTHORIZATION DONE';
export const GET_USER_DATA_DONE = '[AUTH].[USER] GET USER DATA DONE';

/**
 * Authorization Done
 */
export class AuthorizationDone implements Action {
  readonly type = AUTHORIZATION_DONE;
  constructor() {}
}

/**
 * Get User Data Done
 */
export class GetUserDataDone implements Action {
  readonly type = GET_USER_DATA_DONE;
  constructor(public userData: any) {}
}

export type UserActionsAll
    = AuthorizationDone
    | GetUserDataDone;
