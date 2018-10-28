import { Injectable }       from '@angular/core';
import { Router }           from '@angular/router';
import { Location }         from '@angular/common';
import { Effect, Actions }  from '@ngrx/effects';
import { tap, map }         from 'rxjs/operators';

import * as RouterActions   from '../actions/router.action';

@Injectable()
export class RouterEffects
{
  /**
   * Constructor
   *
   * @param {Actions} actions$
   * @param {Router} router
   * @param {Location} location
   * @param {OidcSecurityStorage} oidcSecurityStorage
   */
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Navigate
   */
  @Effect({dispatch: false})
  navigate$ = this.actions$.ofType(RouterActions.GO).pipe(
    map((action: RouterActions.Go) => action.payload),
    tap(({path, query: queryParams, extras}) => {
      if ((!queryParams || !queryParams['returnUrl']) && path.join('/').replace('//', '/') === '/auth/login')
        queryParams = { returnUrl: this.router.url };
      this.router.navigate(path, {queryParams, ...extras});
    })
  );

  /**
   * Navigate back
   * @type {Observable<any>}
   */
  @Effect({dispatch: false})
  navigateBack$ = this.actions$
                      .ofType(RouterActions.BACK)
                      .pipe(tap(() => this.location.back()));

  /**
   * Navigate forward
   * @type {Observable<any>}
   */
  @Effect({dispatch: false})
  navigateForward$ = this.actions$
                          .ofType(RouterActions.FORWARD)
                          .pipe(tap(() => this.location.forward()));
}
