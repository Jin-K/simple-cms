import { Injectable }                               from '@angular/core';
import { Actions, Effect, ofType }                  from '@ngrx/effects';
import { Observable, of }                           from 'rxjs';
import { switchMap, map, catchError, filter }       from 'rxjs/operators';
import { OidcSecurityService }                      from 'angular-auth-oidc-client';

import * as UserActions                             from '../actions/user.actions';

@Injectable()
export class UserEffect {

  constructor(
    private actions$: Actions,
    private oidcSecurityService: OidcSecurityService,
  ) {}

  @Effect()
  getUserData$: Observable<UserActions.GetUserDataDone> = this.actions$.pipe(
    ofType(UserActions.AUTHORIZATION_DONE),
    switchMap(() => this.oidcSecurityService.getUserData().pipe(
      filter(data => data !== ''),
      map(data => new UserActions.GetUserDataDone(data)),
      catchError(error => of(error))
    ))
  );

}
