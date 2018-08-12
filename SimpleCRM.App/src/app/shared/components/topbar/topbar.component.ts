import { Component, Input }     from '@angular/core';
import { MatDrawer }            from '@angular/material';
import { Store }                from '@ngrx/store';
import { Observable }           from 'rxjs';
import { OidcSecurityService }  from 'angular-auth-oidc-client';

import { UserState }            from '../../../root-store';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  @Input()
  drawer: MatDrawer;

  @Input()
  isAuthorized: boolean;

  @Input()
  userState$: Observable<UserState>;

  searchQuery = '';

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.userState$ = this.store.select<UserState>(state => state.user);
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

}
