import { createFeatureSelector, ActionReducerMap }  from "@ngrx/store";

import { UserState, UserReducer }                   from "./user.reducer";
import { SessionState, SessionReducer }             from "./session.reducer";

export interface AuthState {
  user: UserState;
  session: SessionState;
}

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const reducers: ActionReducerMap<AuthState> = {
  user: UserReducer,
  session: SessionReducer
};

export * from './user.reducer';
export * from './session.reducer';
