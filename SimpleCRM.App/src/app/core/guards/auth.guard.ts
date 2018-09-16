import { Injectable, Injector }                                             from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { OidcSecurityService, OidcSecurityStorage }                         from 'angular-auth-oidc-client';
import { Observable }                                                       from 'rxjs';
import { map }                                                              from 'rxjs/operators';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  oidcSecurityService: OidcSecurityService;

  constructor(
    private router: Router,
    private injector: Injector,
    private oidcSecurityStorage: OidcSecurityStorage,
  ) { }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('checking if online...');

    if (this.oidcSecurityService === undefined) {
      this.oidcSecurityService = this.injector.get(OidcSecurityService);
    }

    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        console.log('AuthorizationGuard, canActivate isAuthorized: ' + isAuthorized);

        if (isAuthorized) return true;

        if (!window.location.hash) {
          this.oidcSecurityStorage.write('returnUrl', state.url);
          this.router.navigate(['/unauthorized']);
        }

        return false;
      })
    );
  }
}
