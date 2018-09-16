import { Injectable }           from '@angular/core';
import { CanActivate }          from '@angular/router';
import { OidcSecurityService }  from 'angular-auth-oidc-client';
import { map }                  from 'rxjs/operators';
import { Observable }           from 'rxjs';

/** Used to ensure authentication for some routes
 * Inspired on https://github.com/aviabird/angularspree/blob/master/src/app/core/guards/auth.guard.ts */
@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  isAuthenticated: boolean;
  isRedirecting: boolean;

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) { }

  canActivate(): Observable<boolean> {
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized && !this.isRedirecting) {
          this.isRedirecting = true;
          this.oidcSecurityService.authorize();
        }
        return isAuthorized;
      })
    );
  }
}
