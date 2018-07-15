import * as fromRouter      from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { uiState }          from './uiState.reducer';
import { storeData }        from './storeData.reducer';
import { entityReducer }    from '../entity/entity.reducer';

export const reducers: ActionReducerMap<any> = {
  uiState,
  storeData,
  entity: entityReducer,
  routerReducer: fromRouter.routerReducer
};
