import { Injectable, Output, EventEmitter } from '@angular/core';
require('isomorphic-fetch'); // required for fetch()


/** ref: https://github.com/damienbod/angular-auth-oidc-client/issues/188 */
Injectable()
export class AppConfigService {
  @Output() onConfigurationLoaded = new EventEmitter<boolean>();
  clientConfiguration: any;
  wellKnownEndpoints: any;

  async load() {
    this.clientConfiguration = {
      'stsServer'                                 : 'https://localhost:44321',
      'redirect_url'                              : window.location.origin, // https://localhost:44300 || http://localhost:4200
      'client_id'                                 : 'angularclient',
      'response_type'                             : 'id_token token',
      'scope'                                     : 'dataEventRecords openid profile email',
      'post_logout_redirect_uri'                  : window.location.origin, // https://localhost:44300 || http://localhost:4200
      'start_checksession'                        : false,
      'silent_renew'                              : false,
      'startup_route'                             : '/',
      'forbidden_route'                           : '/unauthorized',
      'unauthorized_route'                        : '/unauthorized',
      'log_console_warning_active'                : true,
      'log_console.debug_active'                  : true,
      'max_id_token_iat_offset_allowed_in_seconds': 10,
      'apiServer': 'https://localhost:44385/'
    };
    await this.load_using_stsServer(this.clientConfiguration.stsServer);
  }

  private async load_using_stsServer(stsServer: string) {
    const response = await fetch(`${stsServer}/.well-known/openid-configuration`);
    this.wellKnownEndpoints = await response.json();
    this.onConfigurationLoaded.emit();
  }
}
