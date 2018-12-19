import { Injectable, Injector }                                     from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store }                                                    from '@ngrx/store';
import { Observable, of }                                           from 'rxjs';
import { map }                                                      from 'rxjs/operators';
import { OidcSecurityService }                                      from 'angular-auth-oidc-client';

import * as fromAppStore                                            from 'app/store';
import * as fromAuthStore                                           from '../main/auth/store';

/**
 * The main AuthGuard class.
 * Chechs if we are logged in
 *
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {

  /**
   * The main oidc service of 'angular-auth-oidc-client'
   *
   * @type {OidcSecurityService}
   * @memberof AuthGuard
   */
  oidcSecurityService: OidcSecurityService;

  /**
   * Constructor
   * @param {Injector} injector angular injection api
   * @param {Store<fromAppStore.State>} store application store
   * @memberof AuthGuard
   */
  constructor(
    private injector: Injector,
    private store: Store<fromAppStore.State>
  ) { }

  /**
   * The main canActivate method implementation.
   *
   * @description Is using 'angular-auth-oidc-client' main service and 'ngrx/store'
   *              to check authorisation and redirect if required
   * @param {ActivatedRouteSnapshot} _activated route snapshot
   * @param {RouterStateSnapshot} state router state snapshot
   * @returns {(Observable<boolean> | boolean)} an observable of true or false
   * @memberof AuthGuard
   */
  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    // if first call
    if (this.oidcSecurityService === undefined) {

      // inject main oidc service
      this.oidcSecurityService = this.injector.get(OidcSecurityService);
    }

    // observ first in store to check if sts server is ok
    return this.store.select(fromAuthStore.getSessionLoaded).switchMap(loaded => {

      // if not
      if (!loaded) {

        // redirect to error page 500
        this.store.dispatch(new fromAppStore.Go({ path: ['/errors/500'], query: { type: 'sts' } }));

        // return observable of false
        return of(false);
      }

      // if server ok and oidc main service configured, check if authorized
      return this.oidcSecurityService.getIsAuthorized().pipe(
        map((isAuthorized: boolean) => {

          // if authorized return true
          if (isAuthorized) return true;

          // if just not authorized redirect to login page
          this.store.dispatch(new fromAppStore.Go({path: ['/auth/login'], query: { returnUrl: state.url }}));

          return false;
        })
      );

    });

  }

}
