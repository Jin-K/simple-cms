import * as fromRouter    from '@ngrx/router-store';
import { EntidadesState } from './entidad/state';
import { NewsState }      from './news/state';
import { RouterStateUrl } from './router-state-serializer';

export interface ApplicationState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  news?: NewsState;
  entidad?: EntidadesState;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  router: {
    state: {
      url: "",
      params: {},
      queryParams: {}
    },
    navigationId: 0
  }
 };
