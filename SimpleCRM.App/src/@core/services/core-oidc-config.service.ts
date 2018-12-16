import { Injectable, Output, EventEmitter, Inject } from '@angular/core';

import { CORE_CONFIG }                              from './config.service';
import { CoreUtils }                                from '../utils';
import { CoreConfig }                               from '../types';


/** ref: https://github.com/damienbod/angular-auth-oidc-client/issues/188 */
Injectable();
export class CoreOidcConfigService {
  private _wellKnownEndpoints: any;
  private _clientConfiguration: any;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onConfigurationLoaded = new EventEmitter<boolean>();

  public get clientConfiguration(): any { return this._clientConfiguration; }
  public get wellKnownEndpoints(): any { return this._wellKnownEndpoints; }

  constructor( @Inject(CORE_CONFIG) private _config ) { }

  async load() {
    if (!this._config.stsServer || !this._config.apiServer) return;
    this._clientConfiguration = this.getClientConfig();
    await this.load_using_stsServer(this.clientConfiguration.stsServer);
  }

  private async load_using_stsServer(stsServer: string) {
    try {
      const response = await fetch(`${stsServer}/.well-known/openid-configuration`);
      this._wellKnownEndpoints = await response.json();
      this.onConfigurationLoaded.emit();
    }
    catch (e) {
      console.error('CoreOidcConfigService - load_using_stsServer : auth service is unavailable', e);
    }
  }

  /**
   * Returns the default client configuration left-merged with
   * the received config object from CoreModule.forRoot()
   */
  private getClientConfig(): any {
    const defaultConfig: CoreConfig = {
      'stsServer'                                 : this._config.stsServer,
      'redirect_url'                              : `${window.location.origin}/assets/pages/auth_callback.html`,
      'client_id'                                 : 'angularclient',
      'response_type'                             : 'id_token token',
      'scope'                                     : 'dataEventRecords openid profile email',
      'post_logout_redirect_uri'                  : this._config.redirect_url || `${window.location.origin}`,
      'start_checksession'                        : false,
      'silent_renew'                              : false,
      'startup_route'                             : '/',
      'forbidden_route'                           : '/auth/forbidden',
      'unauthorized_route'                        : '/auth/unauthorized',
      'log_console_warning_active'                : true,
      'log_console.debug_active'                  : true,
      'max_id_token_iat_offset_allowed_in_seconds': 10,
      'apiServer'                                 : this._config.apiServer
    };
    return CoreUtils.mergeExistingProperties(defaultConfig, this._config);
  }
}

export function OidcConfigFactory(service: CoreOidcConfigService): () => void {
  return () => service.load();
}
