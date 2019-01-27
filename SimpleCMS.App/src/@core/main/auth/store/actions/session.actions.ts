import { Action } from '@ngrx/store';

export const WNE_FETCH_TRY_DONE = '[AUTH].[SESSION] WNE_FETCH_TRY_DONE';
export const SESSION_START      = '[AUTH].[SESSION] SESSION START';
export const SESSION_END        = '[AUTH].[SESSION] SESSION END';

export class WNEFetchTryDone implements Action {
  readonly type = WNE_FETCH_TRY_DONE;
  constructor(public reached: boolean) {}
}

/**
 * Session Start
 */
export class SessionStart implements Action {
  readonly type = SESSION_START;
  constructor() {}
}

/**
 * Session End
 */
export class SessionEnd implements Action {
  readonly type = SESSION_END;
  constructor() {}
}

export type SessionActionsAll
    = WNEFetchTryDone
    | SessionStart
    | SessionStart;
