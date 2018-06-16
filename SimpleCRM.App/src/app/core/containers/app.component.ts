import { Component }            from '@angular/core';
import { OidcSecurityService }  from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchQuery: string = '';

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
