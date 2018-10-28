import * as UserActions from './../actions/user.actions';

export interface UserState {
  given_name  : string;
  email       : string;
  authorized  : boolean;
  roles       : string[];
}

export const UserInitialState: UserState = {
  given_name  : '',
  email       : '',
  authorized  : false,
  roles       : []
}

export function UserReducer(state = UserInitialState, action: UserActions.UserActionsAll): UserState {
  switch(action.type) {

    case UserActions.AUTHORIZATION_DONE:
      return {
        ...state,
        authorized: true
      };
    
    case UserActions.GET_USER_DATA_DONE:
      const userData = action.userData;
      const roles    = userData.role || [];
      return {
        ...state,
        given_name : userData.given_name,
        email : userData.email,
        roles
      };

    default:
      return state;
    
  }
}
