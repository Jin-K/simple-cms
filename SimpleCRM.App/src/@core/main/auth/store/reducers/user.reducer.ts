import * as UserActions from './../actions/user.actions';

export interface UserState {
  given_name  : string;
  email       : string;
  authorized  : boolean;
  roles       : string[];
}

export const UserInitialState: UserState = {
  given_name  : 'Charlie Adams',
  email       : 'adams.charlie@gmail.com',
  authorized  : false,
  roles       : []
};

/**
 * User reducer
 *
 * @export
 * @param {*} [state=UserInitialState] state before reduce
 * @param {UserActions.UserActionsAll} action incoming action
 * @returns {UserState} altered user state if action handler exists
 */
export function UserReducer(state = UserInitialState, action: UserActions.UserActionsAll): UserState {

  switch (action.type) {

    case UserActions.AUTHORIZATION_DONE:

      // return new state
      return {
        ...state,
        authorized: true
      };

    case UserActions.GET_USER_DATA_DONE:

      // prepare constants (references)
      const userData = action.userData;
      const roles    = userData.role || [];

      // return new state
      return {
        ...state,
        given_name : userData.given_name,
        email : userData.email,
        roles
      };

    default:

      // return unaltered state
      return state;

  }

}
