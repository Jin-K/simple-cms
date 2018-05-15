import { NgModule }                     from '@angular/core';
import { HttpClientModule }             from '@angular/common/http';
import { BrowserModule }                from '@angular/platform-browser';
import { BrowserAnimationsModule }      from '@angular/platform-browser/animations';

import {
  StoreRouterConnectingModule,
  RouterStateSerializer
}                                       from '@ngrx/router-store';
import { StoreModule }                  from '@ngrx/store';
import { EffectsModule }                from '@ngrx/effects';
import { StoreDevtoolsModule }          from '@ngrx/store-devtools';

import { storeFreeze }                  from 'ngrx-store-freeze';

import { environment }                  from '../environments/environment';

import { Routing }                      from './routing';
import { EntityComponent }              from './entity/entity.component';
import { ChatComponent }                from './chat/chat.component';

import { AppComponent }                 from './core/containers/app.component';
import { CoreModule }                   from './core/core.module';
import { INITIAL_APPLICATION_STATE }    from './core/application-state';
import { CustomRouterStateSerializer }  from './core/custom-router-state-serializer';
import { reducers }                     from './core/reducers/reducers';



@NgModule({
  declarations: [
    EntityComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Routing,
    // https://github.com/ngrx/platform/blob/master/docs/store/README.md
    StoreModule.forRoot(
      reducers,
      { metaReducers: [storeFreeze], initialState: INITIAL_APPLICATION_STATE }
    ),
    // https://github.com/ngrx/platform/blob/master/docs/router-store/README.md
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router', // name of reducer key
    }),
    // https://github.com/ngrx/platform/blob/master/docs/effects/README.md
    EffectsModule.forRoot([]),
    // https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    CoreModule.forRoot(),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
