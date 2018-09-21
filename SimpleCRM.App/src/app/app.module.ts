import { NgModule, APP_INITIALIZER }            from '@angular/core';
import { HttpClientModule }                     from '@angular/common/http';
import { FormsModule }                          from '@angular/forms';
import { BrowserModule }                        from '@angular/platform-browser';
import { BrowserAnimationsModule }              from '@angular/platform-browser/animations';
import { RouterModule }                         from '@angular/router';

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  AuthWellKnownEndpoints,
  OidcSecurityStorage
}                                               from 'angular-auth-oidc-client';

import { CoreModule }                           from './core';
import { SharedModule }                         from './shared';
import { RootStoreModule }                      from './root-store';

import { AppComponent }                         from './app.component';
import { Routing }                              from './app.routes';
import { HomeComponent, UnauthorizedComponent } from './core/components';
import { AppConfigService }                     from './core/services';

function loadConfig(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    Routing,
    CoreModule,
    AuthModule.forRoot(),
    SharedModule.forRoot(),
    RootStoreModule
  ],
  providers: [
    OidcSecurityService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [AppConfigService],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private appConfigService: AppConfigService,
    private oidcSecurityStorage: OidcSecurityStorage
  ) {
    this.appConfigService.onConfigurationLoaded.subscribe(() => {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer                                   = this.appConfigService.clientConfiguration.stsServer;
        openIDImplicitFlowConfiguration.redirect_url                                = this.appConfigService.clientConfiguration.redirect_url;
        openIDImplicitFlowConfiguration.client_id                                   = this.appConfigService.clientConfiguration.client_id;
        // tslint:disable:max-line-length
        openIDImplicitFlowConfiguration.response_type                               = this.appConfigService.clientConfiguration.response_type;
        openIDImplicitFlowConfiguration.scope                                       = this.appConfigService.clientConfiguration.scope;
        openIDImplicitFlowConfiguration.post_logout_redirect_uri                    = this.appConfigService.clientConfiguration.post_logout_redirect_uri;
        openIDImplicitFlowConfiguration.start_checksession                          = this.appConfigService.clientConfiguration.start_checksession;
        openIDImplicitFlowConfiguration.silent_renew                                = this.appConfigService.clientConfiguration.silent_renew;
        openIDImplicitFlowConfiguration.post_login_route                            = this.oidcSecurityStorage.read('returnUrl') || this.appConfigService.clientConfiguration.startup_route;
        openIDImplicitFlowConfiguration.forbidden_route                             = this.appConfigService.clientConfiguration.forbidden_route;
        openIDImplicitFlowConfiguration.unauthorized_route                          = this.appConfigService.clientConfiguration.unauthorized_route;
        openIDImplicitFlowConfiguration.log_console_warning_active                  = this.appConfigService.clientConfiguration.log_console_warning_active;
        openIDImplicitFlowConfiguration.log_console_debug_active                    = this.appConfigService.clientConfiguration.log_console_debug_active;
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds  = this.appConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;
        // tslint:enable:max-line-length

        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(this.appConfigService.wellKnownEndpoints);

        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    });

    console.log('APP STARTING');
  }
}
