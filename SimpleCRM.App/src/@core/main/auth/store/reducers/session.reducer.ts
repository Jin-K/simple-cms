import * as SessionActions  from './../actions/session.actions';

/**
 * Session state structure
 *
 * @export
 * @interface SessionState
 */
export interface SessionState {
  started     : Date | undefined;
  loaded      : boolean | undefined;
}
/**
 * Session initial state
 *
 * @export
 * @const
 * @type SessionState
 */
export const SessionInitialState: SessionState = {
  started : undefined,
  loaded  : undefined
};

/**
 * Session reducer
 *
 * @export
 * @param {*} [state=SessionInitialState] state before reduce
 * @param {SessionActions.SessionActionsAll} action incoming action
 * @returns {SessionState} altered session state if action handler exists
 */
export function SessionReducer(state = SessionInitialState, action: SessionActions.SessionActionsAll): SessionState {

  switch (action.type) {

    case SessionActions.WNE_FETCH_TRY_DONE:

      // return new state
      return {
        ...state,
        loaded: action.reached
      };

    case SessionActions.SESSION_START:

      // return new state
      return {
        ...state,
        started: new Date()
      };

    default:

      // return unaltered state
      return state;

  }

}
