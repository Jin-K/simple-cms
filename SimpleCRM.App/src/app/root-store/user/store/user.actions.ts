import { Action } from '@ngrx/store';

export const AUTHORIZE_COMPLETE = '[user] AUTHORIZE_COMPLETE';

export class AuthorizeComplete implements Action {
  readonly type = AUTHORIZE_COMPLETE;

  constructor(public login: string) { }
}

export type Actions
  = AuthorizeComplete;
