import { Params }       from '@angular/router';
import * as fromRouter  from '@ngrx/router-store';

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
export interface StoreData {
  // participants: {[key:number]: Participant};
  // threads: {[key:number]: Thread};
  // messages: {[key:number]:Message};
}
export const INITIAL_STORE_DATA: StoreData = {
  // threads: {},
  // messages: {},
  // participants: {}
};

/** **** **** **** **** *** URL/Router State management *** **** **** **** **** **/
interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export interface ApplicationState {
  uiState: UiState,
  storeData: StoreData,
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  uiState: INITIAL_UI_STATE,
  storeData: INITIAL_STORE_DATA,
  routerReducer: undefined
}