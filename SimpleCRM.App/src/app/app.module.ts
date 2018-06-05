import { NgModule, APP_INITIALIZER }    from '@angular/core';
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

import {
  AuthModule,
  OidcSecurityService,
  OidcConfigService,
  OpenIDImplicitFlowConfiguration,
  AuthWellKnownEndpoints
}                                       from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load(`${window.location.origin}/api/ClientAppSettings`);
}


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
    AuthModule.forRoot(),
    CoreModule.forRoot()
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    OidcSecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer                                   = this.oidcConfigService.clientConfiguration.stsServer;
      openIDImplicitFlowConfiguration.redirect_url                                = this.oidcConfigService.clientConfiguration.redirect_url;
      openIDImplicitFlowConfiguration.client_id                                   = this.oidcConfigService.clientConfiguration.client_id;
      openIDImplicitFlowConfiguration.response_type                               = this.oidcConfigService.clientConfiguration.response_type;
      openIDImplicitFlowConfiguration.scope                                       = this.oidcConfigService.clientConfiguration.scope;
      openIDImplicitFlowConfiguration.post_logout_redirect_uri                    = this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
      openIDImplicitFlowConfiguration.start_checksession                          = this.oidcConfigService.clientConfiguration.start_checksession;
      openIDImplicitFlowConfiguration.silent_renew                                = this.oidcConfigService.clientConfiguration.silent_renew;
      openIDImplicitFlowConfiguration.post_login_route                            = this.oidcConfigService.clientConfiguration.startup_route;
      openIDImplicitFlowConfiguration.forbidden_route                             = this.oidcConfigService.clientConfiguration.forbidden_route;
      openIDImplicitFlowConfiguration.unauthorized_route                          = this.oidcConfigService.clientConfiguration.unauthorized_route;
      openIDImplicitFlowConfiguration.log_console_warning_active                  = this.oidcConfigService.clientConfiguration.log_console_warning_active;
      openIDImplicitFlowConfiguration.log_console_debug_active                    = this.oidcConfigService.clientConfiguration.log_console_debug_active;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    });

    console.log('APP STARTING');
  }
}
