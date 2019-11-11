import { Injectable, Output, EventEmitter, Inject } from '@angular/core';

import { CORE_CONFIG }                              from './config.service';
import { CoreUtils }                                from '../utils';
import { CoreConfig }                               from '../types';
import { Store }                                    from '@ngrx/store';
import { SessionActions }                           from '../main/auth/store/actions';


/** ref:  */


/**
 * The main CoreOidcConfigService.
 *
 * @see [https://github.com/damienbod/angular-auth-oidc-client/issues/188](https://github.com/damienbod/angular-auth-oidc-client/issues/188)
 * @export
 * @class CoreOidcConfigService
 */
Injectable();
export class CoreOidcConfigService {

  /**
   * Well known endpoints json object.
   * Is retrieved from sts server
   *
   * @description Contains informations about other endpoints of the sts server
   * @private
   * @type {*}
   * @memberof CoreOidcConfigService
   */
  private _wellKnownEndpoints: any;

  /**
   * Client configuration object for our application.
   * Check {@link #getClientConfig()}
   *
   * @private
   * @type {*}
   * @memberof CoreOidcConfigService
   */
  private _clientConfiguration: any;

  /**
   * Event that is emitted when we obtain json response from sts server
   *
   * @see AuthModule
   * @memberof CoreOidcConfigService
   */
  @Output() onConfigurationLoaded = new EventEmitter<boolean>();

  public get clientConfiguration(): any { return this._clientConfiguration; }
  public get wellKnownEndpoints(): any { return this._wellKnownEndpoints; }

  constructor( @Inject(CORE_CONFIG) private _config, private _store: Store<any> ) { }

  async load() {
    if (!this._config.stsServer) return;
    this._clientConfiguration = this.getClientConfig();
    await this.load_using_stsServer(this.clientConfiguration.stsServer);
  }

  private async load_using_stsServer(stsServer: string) {

    // prepare success variable
    let success = false;

    // try to reach sts server
    try {

      // fetch well known endpoints
      const response = await fetch(`${stsServer}/.well-known/openid-configuration`);
      this._wellKnownEndpoints = await response.json();

      // trigger the next event
      this.onConfigurationLoaded.emit();

      // set success to true
      success = true;
    }
    catch (_) { }

    // dispatch a "well known endpoints fetch try done" action
    this._store.dispatch(new SessionActions.WNEFetchTryDone(success));
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
