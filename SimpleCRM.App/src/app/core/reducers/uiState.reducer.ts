import { INITIAL_UI_STATE, UiState }  from '../application-state';
import { Action }                     from '@ngrx/store';

export function uiState(state: UiState = INITIAL_UI_STATE, action: Action): UiState {
  switch (action.type) {
    default: return state;
  }
}
