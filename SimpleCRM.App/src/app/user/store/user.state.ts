export interface UserState {
  isConnected: boolean;
  login: string;
}

export const INITIAL_USER_STATE: UserState = {
  isConnected: false,
  login: null
};
