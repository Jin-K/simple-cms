import { OnInit, Injector, OnDestroy }    from '@angular/core';
import { MatSnackBar }                    from '@angular/material';
import { Store }                          from '@ngrx/store';
import { Subject }                        from 'rxjs';
import { takeUntil }                      from 'rxjs/operators';
import { OidcSecurityService }            from 'angular-auth-oidc-client';

import { UserActions, SessionSelectors }  from './store';

/**
 * The main AuthAppBase class.
 * Base class for an authenticated app
 *
 * @export
 * @abstract
 * @class AuthAppBase
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export abstract class AuthAppBase implements OnInit, OnDestroy {

  /**
   * Subject to unsubscribe from existing subscriptions.
   * Can be used in child component (app.component.ts) to unsubscribe from other subscriptions.
   *
   * @protected
   * @type {Subject<any>}
   * @memberof AuthAppBase
   */
  protected _unsubscribeAll: Subject<any> = new Subject();

  /**
   * Angular injector api
   * Is abstract property because it should be injected in child component's constructor (app.component.ts).
   *
   * @protected
   * @abstract
   * @type {Injector}
   * @memberof AuthAppBase
   */
  protected abstract _injector: Injector;

  /**
   * Store for authentication state
   *
   * @private
   * @type {Store<any>}
   * @memberof AuthAppBase
   */
  private _store: Store<any>;

  /**
   * Oidc security service (from angular-auth-oidc-client)
   *
   * @private
   * @type {OidcSecurityService}
   * @memberof AuthAppBase
   */
  private _oidcSecurityService: OidcSecurityService;

  /**
   * Initialization of the base class.
   * If child component implements OnInit, a super call to this method has to be done.
   *
   * @example
   * export class AppComponent extends AuthAppBase implements OnInit {
   *
   *    // rest of child component class
   *
   *    ngOnInit(): void {
   *
   *      // call base method
   *      super.ngOnInit();
   *
   *      // rest of instructions in child component's ngOnInit
   *
   *    }
   *
   *    // rest of child component class
   *
   * }
   *
   * @memberof AuthAppBase
   */
  ngOnInit(): void {

    // inject store
    this._store = this._injector.get(Store);

    // inject oidc security service (from angular-auth-oidc-client)
    this._oidcSecurityService = this._injector.get(OidcSecurityService);

    // check if auth session was loaded from selector
    this._store.select(SessionSelectors.getSessionLoaded)

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // filter on isLoaded === false (it could be undefined as in state.auth.session initial state)
      .filter(isLoaded => isLoaded === false)

      // subscribe and open error snackbar if event received
      .subscribe(_ => {

        // run after the current event loop tick (known issue: https://github.com/angular/angular/issues/15634#issuecomment-345504902)
        setTimeout( () =>

          // inject MatSnackBar service and dynamically create an error snackbar (display 60 seconds at top right)
          this._injector.get(MatSnackBar).open('STS server is unavailable !', 'Dismiss', { duration: 60 * 1000, horizontalPosition: 'end', verticalPosition: 'top' })
        );
      });

    // subscribe to authorization changes to dispatch an action of type 'AUTHORIZATION DONE' when authenticated
    this._oidcSecurityService.getIsAuthorized()

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // filter on isAuthorized == true
      .filter(isAuthorized => isAuthorized)

      // subscribe and dispatch 'AUTHORIZATION DONE' if triggered (isAuthorized == true)
      .subscribe(_ => this._store.dispatch(new UserActions.AuthorizationDone));

  }

  /**
   * Destruction of the base class.
   * If child component implements OnDestroy, a super call to this method has to be done.
   *
   * @example
   * export class AppComponent extends AuthAppBase implements OnInit {
   *
   *    // rest of child component class
   *
   *    ngOnDestroy(): void {
   *
   *      // call base method
   *      super.ngOnDestroy();
   *
   *      // rest of instructions in child component's ngOnDestroy
   *
   *    }
   *
   *    // rest of child component class
   *
   * }
   *
   * @memberof AuthAppBase
   */
  ngOnDestroy(): void {

    // trigger unsubscription
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }

}
