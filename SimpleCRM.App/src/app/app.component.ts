
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router }                       from '@angular/router';
import { Store }                        from '@ngrx/store';
import { Subscription }                 from 'rxjs';
import { OidcSecurityService }          from 'angular-auth-oidc-client';
import { userActions }                  from './root-store/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthorizedSubscription!: Subscription;
  isAuthorized = false;

  hasAdminRole = false;
  hasDataEventRecordsAdminRole = false;
  userDataSubscription!: Subscription;
  userData: any;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {
    if (this.oidcSecurityService.moduleSetup)
      this.doCallbackLogicIfRequired();
    else
      this.oidcSecurityService.onModuleSetup.subscribe(() => this.doCallbackLogicIfRequired());
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      isAuthorized => {
        if (this.isAuthorized && !isAuthorized) this.router.navigate(['']);
        this.isAuthorized = isAuthorized;
      }
    );

    this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
      userData => {
        if (userData && userData !== '' && userData.role) {
          this.store.dispatch(new userActions.AuthorizeComplete(userData.given_name));

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
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
