import { Injectable, Injector }                                 from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable }                                           from 'rxjs';
import { OidcSecurityService }                                  from 'angular-auth-oidc-client';
import { CoreConfigService }                                    from '@core/services';

/**
 * Intercepts xhr requests and sets an authorization header if required
 * ref: https://github.com/damienbod/angular-auth-oidc-client#http-interceptor
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private oidcSecurityService: OidcSecurityService;

  constructor(
    private injector: Injector,
    private coreconfigService: CoreConfigService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestToForward: HttpRequest<any> = req;

    if (this.oidcSecurityService === undefined) this.oidcSecurityService = this.injector.get(OidcSecurityService);
    
    if (this.oidcSecurityService !== undefined) {
      // only if requests to main api
      if (~requestToForward.url.indexOf(this.coreconfigService.getConfigValue('apiServer'))) {
        let token = this.oidcSecurityService.getToken();
        if (token !== '') {
          let tokenValue = 'Bearer ' + token;
          requestToForward = req.clone({ setHeaders: { Authorization: tokenValue } });
        }
      }
    }
    else console.debug('OidcSecurityService undefined: NO auth header!');

    return next.handle(requestToForward);
  }
}
