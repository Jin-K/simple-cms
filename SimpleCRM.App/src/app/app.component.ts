
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store }                        from '@ngrx/store';
import { Subscription, Observable }     from 'rxjs';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import * as UserActions                 from './root-store/user/actions';
import { UserState }                    from './root-store/user/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  searchQuery = '';

  isAuthorizedSubscription!: Subscription;
  isAuthorized = false;

  hasAdminRole = false;
  hasDataEventRecordsAdminRole = false;
  userDataSubscription!: Subscription;
  userData: any;

  userState$: Observable<UserState>;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.userState$ = this.store.select<UserState>(state => state.user);

    if (this.oidcSecurityService.moduleSetup) this.doCallbackLogicIfRequired();
    else this.oidcSecurityService.onModuleSetup.subscribe(() => this.doCallbackLogicIfRequired());
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      isAuthorized => {
        this.isAuthorized = isAuthorized;
      }
    );

    this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
      userData => {
        if (userData && userData !== '' && userData.role) {
          this.store.dispatch(new UserActions.AuthorizeComplete(userData.given_name));

          for (let i = 0; i < userData.role.length; i++) {
            switch (userData.role[i]) {
              case 'dataEventRecords.admin':
                this.hasDataEventRecordsAdminRole = true;
                break;
              case 'admin':
                this.hasAdminRole = true;
                break;
            }
          }
        }

        console.log('userData getting data');
      }
    );
  }

  ngOnDestroy() {
    if (this.isAuthorizedSubscription) this.isAuthorizedSubscription.unsubscribe();
    if (this.userDataSubscription) this.userDataSubscription.unsubscribe();
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  doCallbackLogicIfRequired(): any {
    if (window.location.hash) {
      console.log('doing stuff');
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
