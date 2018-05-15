import * as fromRouter  from '@ngrx/router-store';
import { uiState }      from './uiState.reducer';
import { storeData }    from './storeData.reducer';

export const reducers = {
  uiState,
  storeData,
  routerReducer: fromRouter.routerReducer
};
