import { Injectable, Injector }                                     from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store }                                                    from '@ngrx/store';
import { Observable }                                               from 'rxjs';
import { map }                                                      from 'rxjs/operators';
import { OidcSecurityService }                                      from 'angular-auth-oidc-client';

import * as fromStore                                               from 'app/store';

@Injectable()
export class AuthGuard implements CanActivate {
  oidcSecurityService: OidcSecurityService;

  constructor(
    private injector: Injector,
    private store: Store<fromStore.State>
  ) { }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('checking if online...');

    if (this.oidcSecurityService === undefined) {
      this.oidcSecurityService = this.injector.get(OidcSecurityService);
    }

    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (isAuthorized) return true;

        if (!window.location.hash)
          this.store.dispatch(new fromStore.Go({path: ['/auth/login'], query: { returnUrl: state.url }}));

        return false;
      })
    );
  }
}
