import { INITIAL_STORE_DATA, StoreData }  from '../application-state';
import { Action }                         from '@ngrx/store';

export function storeData(state: StoreData = INITIAL_STORE_DATA, action: Action): StoreData {
  switch (action.type) {
    default: return state;
  }
}
