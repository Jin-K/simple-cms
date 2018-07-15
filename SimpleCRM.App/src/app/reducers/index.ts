import * as fromRouter      from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { ApplicationState } from './application-state';
import { uiState }          from './uiState.reducer';
import { storeData }        from './storeData.reducer';
import { entityReducer }    from '../entity/entity.reducer';

export const reducers: ActionReducerMap<ApplicationState> = {
  uiState,
  storeData,
  entity: entityReducer,
  routerReducer: fromRouter.routerReducer
};
