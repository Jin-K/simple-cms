import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR                     from '@aspnet/signalr';
import { Subscription }                 from 'rxjs';
import { OidcSecurityService }          from 'angular-auth-oidc-client';
import { Configuration }                from '../../../app.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _hubConnection: signalR.HubConnection | undefined;
  async: any;
  message = '';
  messages: string[] = [];

  isAuthorizedSuscription: Subscription | undefined;
  isAuthorized = false;

  constructor(
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService
  ) { }

  ngOnInit(): void {
    this.isAuthorizedSuscription = this.oidcSecurityService.getIsAuthorized().subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
      if (this.isAuthorized) this.init();
    });
    console.log('IsAuthorized:' + this.isAuthorized);
  }

  ngOnDestroy(): void {
    if (this.isAuthorizedSuscription) this.isAuthorizedSuscription.unsubscribe();
  }

  private init() {
    const token = this.oidcSecurityService.getToken();
    let tokenValue = '';
    if (token !== '') tokenValue = '?token=' + token;

    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.configuration.api_endpoint}signalrhome${tokenValue}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', data => {
      const received = `Received: ${data}`;
      this.messages.push(received);
    });
  }
}
