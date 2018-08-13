import { NgModule, APP_INITIALIZER }    from '@angular/core';
import { HttpClientModule }             from '@angular/common/http';
import { FormsModule }                  from '@angular/forms';
import { BrowserModule }                from '@angular/platform-browser';
import { BrowserAnimationsModule }      from '@angular/platform-browser/animations';
import { RouterModule }                 from '@angular/router';

import {
  AuthModule,
  OidcSecurityService,
  OidcConfigService,
  OpenIDImplicitFlowConfiguration,
  AuthWellKnownEndpoints
}                                       from 'angular-auth-oidc-client';

import { SharedModule }                 from './shared/shared.module';
import { RootStoreModule }              from './root-store';

import { AppComponent }                 from './app.component';
import { Routing }                      from './app.routes';
import { HomeComponent }                from './containers/home/home.component';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(`${window.location.origin}/api/ClientAppSettings`);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    Routing,
    AuthModule.forRoot(),
    SharedModule.forRoot(),
    RootStoreModule
  ],
  providers: [
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
      // tslint:disable:max-line-length
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
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds  = this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;
      // tslint:enable:max-line-length

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    });

    console.log('APP STARTING');
  }
}
