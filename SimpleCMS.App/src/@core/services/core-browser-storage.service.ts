import { Injectable, Inject } from '@angular/core';
import { OidcSecurityStorage, AuthConfiguration } from 'angular-auth-oidc-client';
import { CORE_CONFIG } from './config.service';

/**
 * Core Browser Storage service used for authentication settings
 */
@Injectable()
export class CoreBrowserStorage implements OidcSecurityStorage {
  private hasStorage: boolean;

  constructor(
    @Inject(CORE_CONFIG) private _config,
    private authConfiguration: AuthConfiguration
  ) {
    this.hasStorage = typeof Storage !== undefined;
    if (!this.hasStorage) console.warn('BrowserStorage will not work');
  }
    
  read(key: string): any {
    if (!this.hasStorage) return;
    const client_id = this._config.client_id || this.authConfiguration.client_id;
    return JSON.parse(this.authConfiguration.storage.getItem(`${client_id}#${key}`))
  }
  
  write(key: string, value: any): void {
    if (!this.hasStorage) return;
    const client_id = this._config.client_id || this.authConfiguration.client_id;
    this.authConfiguration.storage.setItem(`${client_id}#${key}`, JSON.stringify(value || null));
  }

}
