import { Action } from '@ngrx/store';

export const SESSION_START  = '[AUTH].[SESSION] SESSION START';
export const SESSION_END    = '[AUTH].[SESSION] SESSION END';

/**
 * Session Start
 */
export class SessionStart implements Action {
  readonly type = SESSION_START;
  constructor(public token: string) {}
}

/**
 * Session End
 */
export class SessionEnd implements Action {
  readonly type = SESSION_END;
  constructor() {}
}

export type SessionActionsAll
    = SessionStart
    | SessionStart;
