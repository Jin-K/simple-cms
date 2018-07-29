import { Params }       from '@angular/router';
import * as fromRouter  from '@ngrx/router-store';
// import { EntitiesState, INITIAL_ENTITIES_STATE }  from '../entity/state';


/** **** **** **** **** **** Local UI State management **** **** **** **** **** **/
export interface UiState {
  // userId:number;
  // currentThreadId: number;
  // currentError?: string;
}
export const INITIAL_UI_STATE: UiState = {
  // userId: undefined,
  // currentThreadId: undefined
};

/** *** Persistent State - Client State - Transient Client State management *** **/
// In modules

/** **** **** **** **** *** URL/Router State management *** **** **** **** **** **/
interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export interface ApplicationState {
  uiState: UiState;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  uiState: INITIAL_UI_STATE,
  router: undefined
};
