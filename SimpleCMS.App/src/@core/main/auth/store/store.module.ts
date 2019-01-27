import { NgModule }       from '@angular/core';
import { StoreModule }    from '@ngrx/store';
import { EffectsModule }  from '@ngrx/effects';

import { reducers }       from './reducers';
import { effects }        from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: []
})
export class AuthStoreModule { }
