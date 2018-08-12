import * as fromRouter                    from '@ngrx/router-store';
import { EntidadesState }                 from './entidad/state';
import { NewsState }                      from './news/state';
import { RouterStateUrl }                 from './router-state-serializer';
import { INITIAL_USER_STATE, UserState }  from './user/state';

export interface ApplicationState {
  user: UserState;
  router?: fromRouter.RouterReducerState<RouterStateUrl>;
  news?: NewsState;
  entidad?: EntidadesState;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  router: undefined,
  user: INITIAL_USER_STATE
};
