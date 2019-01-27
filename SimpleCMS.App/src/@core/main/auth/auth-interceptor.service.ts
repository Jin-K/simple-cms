import { Injectable, Injector }                                 from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable }                                           from 'rxjs';
import { OidcSecurityService }                                  from 'angular-auth-oidc-client';
import { CoreConfigService }                                    from '@core/services';

/**
 * The main AuthInterceptor class.
 *
 * @description Intercepts xhr requests and sets an authorization header if required
 * @export
 * @class AuthInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Main oidc service of 'angular-auth-oidc-client'
   *
   * @private
   * @type {OidcSecurityService}
   * @memberof AuthInterceptor
   */
  private oidcSecurityService: OidcSecurityService;

  /**
   * Constructor
   *
   * @param {Injector} injector angular inject api
   * @param {CoreConfigService} coreConfigService our core configuration service
   * @memberof AuthInterceptor
   */
  constructor(
    private injector: Injector,
    private coreConfigService: CoreConfigService
  ) { }

  /**
   * Intercepts xhr requests and appends authorization headers
   * if it detects that the destination is our main api server
   *
   * @param {HttpRequest<any>} req outgoing xhr request
   * @param {HttpHandler} next forward method to continue processing request
   * @returns {Observable<HttpEvent<any>>} returns an observable of the xhr request
   * @memberof AuthInterceptor
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // reference in other variable
    let requestToForward: HttpRequest<any> = req;

    // if first interception and oidcSecurityService still undefined ==> inject with angular api
    if (this.oidcSecurityService === undefined) this.oidcSecurityService = this.injector.get(OidcSecurityService);

    // if OK (injected with success)
    if (this.oidcSecurityService !== undefined) {

      // only if requests to main api
      if (~requestToForward.url.indexOf(this.coreConfigService.getConfigValue('apiServer'))) {

        // get token from auth service
        const token = this.oidcSecurityService.getToken();

        if (token !== '') {

          // prepare header string
          const tokenValue = 'Bearer ' + token;

          // create new xhr request object with 'Authorization' header
          requestToForward = req.clone({ setHeaders: { Authorization: tokenValue } });
        }
      }
    }
    // couldn't inject OidcSecurityService from 'angular-auth-oidc-client'
    // tslint:disable-next-line:no-console
    else console.debug('OidcSecurityService undefined: NO auth header!');

    // forward to processing request method and return observable
    return next.handle(requestToForward);

  }

}
