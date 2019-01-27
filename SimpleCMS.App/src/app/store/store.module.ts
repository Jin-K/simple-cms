import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { reducers, CustomSerializer } from './reducers';
import { effects } from './effects';

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot(effects),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    StoreRouterConnectingModule
  ],
  providers: [
    {
      provide : RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})
export class AppStoreModule { }
