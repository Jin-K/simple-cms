import { OnInit, Injector, OnDestroy }  from '@angular/core';
import { Store }                        from '@ngrx/store';
import { Subject }                      from 'rxjs';
import { takeUntil }                    from 'rxjs/operators';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import { UserActions }                  from './store';

/**
 * Base class for an authenticated app
 */
export abstract class AuthAppBase implements OnInit, OnDestroy {

  // Protected
  protected _unsubscribeAll: Subject<any> = new Subject();
  protected abstract _injector: Injector;

  // Private
  private _store: Store<any>;
  private _oidcSecurityService: OidcSecurityService;

  /**
   * On init
   */
  ngOnInit(): void {
    this._store = this._injector.get(Store);
    this._oidcSecurityService = this._injector.get(OidcSecurityService);

    this._oidcSecurityService.getIsAuthorized()
      .pipe(takeUntil(this._unsubscribeAll))
      .filter(isAuthorized => isAuthorized)
      .subscribe(_ => this._store.dispatch(new UserActions.AuthorizationDone))
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  
}