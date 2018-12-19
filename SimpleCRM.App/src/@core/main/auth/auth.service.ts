import { Injectable, }             from '@angular/core';
import {
  OpenIDImplicitFlowConfiguration,
  AuthWellKnownEndpoints,
  OidcSecurityService
}                                 from 'angular-auth-oidc-client';

import { CoreOidcConfigService }  from './../../services';

@Injectable({providedIn: 'root'})
export class AuthService {

  /**
   * openID configuration instance, referenced as needed in resetPostLoginRoute(string)
   *
   * @private
   * @memberof AuthService
   */
  private readonly openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

  /**
   * Constructor
   *
   * @param {OidcSecurityService} oidcSecurityService main oidc service of 'angular-auth-oidc-client'
   * @param {CoreOidcConfigService} coreOidcConfigService main config service of 'angular-auth-oidc-client'
   */
  constructor(
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly coreOidcConfigService: CoreOidcConfigService,
    private authWellKnownEndpoints: AuthWellKnownEndpoints
  ) { }

  /**
   * Setup main module of 'angular-auth-oidc-client' which is wrapped
   *
   * @memberof AuthService
   */
  setupRealAuthModuleModule(): void {
    debugger;

    // set well known endpoints from sts server
    this.authWellKnownEndpoints.setWellKnownEndpoints(this.coreOidcConfigService.wellKnownEndpoints);

    // copy property values
    this.openIDImplicitFlowConfiguration.stsServer                                   = this.coreOidcConfigService.clientConfiguration.stsServer;
    this.openIDImplicitFlowConfiguration.redirect_url                                = this.coreOidcConfigService.clientConfiguration.redirect_url;
    this.openIDImplicitFlowConfiguration.client_id                                   = this.coreOidcConfigService.clientConfiguration.client_id;
    this.openIDImplicitFlowConfiguration.response_type                               = this.coreOidcConfigService.clientConfiguration.response_type;
    this.openIDImplicitFlowConfiguration.scope                                       = this.coreOidcConfigService.clientConfiguration.scope;
    this.openIDImplicitFlowConfiguration.post_logout_redirect_uri                    = this.coreOidcConfigService.clientConfiguration.post_logout_redirect_uri;
    this.openIDImplicitFlowConfiguration.start_checksession                          = this.coreOidcConfigService.clientConfiguration.start_checksession;
    this.openIDImplicitFlowConfiguration.silent_renew                                = this.coreOidcConfigService.clientConfiguration.silent_renew;
    this.openIDImplicitFlowConfiguration.post_login_route                            = this.coreOidcConfigService.clientConfiguration.startup_route;
    this.openIDImplicitFlowConfiguration.forbidden_route                             = this.coreOidcConfigService.clientConfiguration.forbidden_route;
    this.openIDImplicitFlowConfiguration.unauthorized_route                          = this.coreOidcConfigService.clientConfiguration.unauthorized_route;
    this.openIDImplicitFlowConfiguration.log_console_warning_active                  = this.coreOidcConfigService.clientConfiguration.log_console_warning_active;
    this.openIDImplicitFlowConfiguration.log_console_debug_active                    = this.coreOidcConfigService.clientConfiguration.log_console_debug_active;
    this.openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds  = this.coreOidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

    // setup angular-auth-oidc-client module
    this.oidcSecurityService.setupModule(this.openIDImplicitFlowConfiguration, this.authWellKnownEndpoints);

  }

  /**
   * Set post_login_route in OidcSecurityService.authConfiguration (OpenIDImplicitFlowConfiguration)
   * in a tricky way, and invoke OidcSecurityService.setupModule() again
   *
   * @param {string} returnUrl return path (route) that should be used by angular-auth-oidc-client to redirect on authorization callback
   */
  resetPostLoginRoute(returnUrl: string): void {

    // set post_login_route
    this.openIDImplicitFlowConfiguration.post_login_route = returnUrl;

    // setup angular-auth-oidc-client module
    this.oidcSecurityService.setupModule(this.openIDImplicitFlowConfiguration, this.authWellKnownEndpoints);

  }

}
