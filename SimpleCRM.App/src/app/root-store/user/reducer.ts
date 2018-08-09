import { UserState, INITIAL_USER_STATE }  from './state';
import * as UserAction                    from './actions';


export function userReducer(state: UserState = INITIAL_USER_STATE, action: UserAction.Actions): UserState {
  switch (action.type) {

    case UserAction.AUTHORIZE_COMPLETE:
      return Object.assign({}, state, {
        isConnected: true,
        login: action.login
      });

    default: return state;

  }
}
