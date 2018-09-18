import { UserState, INITIAL_USER_STATE }  from './state';
import { Actions, AUTHORIZE_COMPLETE }    from './actions';

export function userReducer(state: UserState = INITIAL_USER_STATE, action: Actions): UserState {
  switch (action.type) {

    case AUTHORIZE_COMPLETE:
      return Object.assign({}, state, {
        isConnected: true,
        login: action.login
      });

    default: return state;

  }
}
