import { Injectable }                   from '@angular/core';
import { Actions, Effect, ofType }      from '@ngrx/effects';
import { Observable, of }               from 'rxjs';
import { catchError, map }              from 'rxjs/operators';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import { UserActions, SessionActions }  from '../actions';


@Injectable()
export class SessionEffect {
  constructor(
    private actions$: Actions,
    private oidcSecurityService: OidcSecurityService
  ) {}

  @Effect()
  authorized$: Observable<SessionActions.SessionStart> = this.actions$.pipe(
    ofType(UserActions.AUTHORIZATION_DONE),
    map(_ => new SessionActions.SessionStart(this.oidcSecurityService.getToken())),
    catchError(error => of(error))
  );

  @Effect({dispatch: false})
  sessionEnd$ = this.actions$.pipe(
    ofType(SessionActions.SESSION_END),
    map(_ => this.oidcSecurityService.logoff()),
    catchError(error => of(error))
  );
}