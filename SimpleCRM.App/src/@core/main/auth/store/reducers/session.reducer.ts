import * as SessionActions  from './../actions/session.actions';

export interface SessionState {
  started : Date | undefined;
  loaded  : boolean;
  token   : string;
}

export const SessionInitialState: SessionState = {
  started : undefined,
  loaded  : false,
  token   : ''
}

export function SessionReducer(state = SessionInitialState, action: SessionActions.SessionActionsAll): SessionState {
  switch(action.type) {

    case SessionActions.SESSION_START:
      return {
        started: new Date(),
        loaded: true,
        token: action.token
      };

    default:
      return state;
    
  }
}
