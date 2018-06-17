import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription }                 from 'rxjs';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  searchQuery = '';

  isAuthorizedSubscription: Subscription;
  isAuthorized = false;

  constructor(private oidcSecurityService: OidcSecurityService) {
    if (this.oidcSecurityService.moduleSetup) this.doCallbackLogicIfRequired();
    else this.oidcSecurityService.onModuleSetup.subscribe(() => this.doCallbackLogicIfRequired());
  }

  // Todo: Déplacer ça (login, logout) ailleurs non ?
  login() {
    console.log('Do login logic');
    this.oidcSecurityService.authorize();
  }

  logout() {
    console.log('Do logout logic');
    this.oidcSecurityService.logoff();
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    if (this.isAuthorizedSubscription) this.isAuthorizedSubscription.unsubscribe();
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  doCallbackLogicIfRequired(): any {
    if (window.location.hash) {
      console.log('doing stuff');
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
