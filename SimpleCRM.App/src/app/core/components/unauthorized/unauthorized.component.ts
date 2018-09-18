import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

const REDIRECT_TIMEOUT = 1500;

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit, OnDestroy {

  constructor(private oidcSecurityservice: OidcSecurityService) {
    this.oidcSecurityservice.onModuleSetup.subscribe(() => this.onModuleSetup.bind(this));
  }

  ngOnInit() {
    console.log('redirecting...');
    if (this.oidcSecurityservice.moduleSetup) this.onModuleSetup();
  }

  ngOnDestroy(): void {
    this.oidcSecurityservice.onModuleSetup.unsubscribe();
  }

  private onModuleSetup(): void {
    setTimeout(() => this.oidcSecurityservice.authorize(), REDIRECT_TIMEOUT);
  }

}
