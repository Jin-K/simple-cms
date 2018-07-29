import * as fromRouter      from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { ApplicationState } from './application-state';
import { uiState }          from './uiState.reducer';

export const reducers: ActionReducerMap<ApplicationState> = {
  uiState,
  router: fromRouter.routerReducer
};
