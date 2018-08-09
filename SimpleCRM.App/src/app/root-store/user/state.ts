export interface UserState {
  isConnected: boolean;
  login: string | null;
}

export const INITIAL_USER_STATE: UserState = {
  isConnected: false,
  login: null
};
