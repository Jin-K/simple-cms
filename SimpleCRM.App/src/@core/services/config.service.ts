import { InjectionToken, Injectable, Inject, Output, EventEmitter } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';

export const CORE_CONFIG = new InjectionToken('coreCustomConfig');

@Injectable({providedIn: 'root'})
export class CoreConfigService {
  private readonly _defaultConfig: any;
  private _wellKnownEndpoints: any;

  // tslint:disable-next-line:no-output-on-prefix
  public get wellKnownEndpoints(): any { return this._wellKnownEndpoints; }

  /**
   * Constructor
   *
   * @param {Platform}_platform
   * @param {Router} _router
   * @param _config
   */
  constructor(
    private _platform: Platform,
    private _router: Router,
    @Inject(CORE_CONFIG) private _config
  ) {
    // Set the default config from the user provided config (from forRoot)
    this._defaultConfig = _config;
  }

  public getConfigValue(key: string): any {
    return this._defaultConfig[key];
  }
}
