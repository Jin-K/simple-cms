import { Component, Input }     from '@angular/core';
import { MatDrawer }            from '@angular/material';
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
  searchQuery: string;

  @Input()
  isAuthorized: boolean;

  @Input()
  userState: UserState;

  constructor(private oidcSecurityService: OidcSecurityService) { }

  login() {
    console.log('Do login logic');
    this.oidcSecurityService.authorize();
  }

  logout() {
    console.log('Do logout logic');
    this.oidcSecurityService.logoff();
  }

}
