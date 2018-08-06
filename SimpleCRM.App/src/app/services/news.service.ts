import { Injectable }                           from '@angular/core';
import { HttpHeaders, HttpClient }              from '@angular/common/http';
import { Observable, Subscription }             from 'rxjs';
import { Store }                                from '@ngrx/store';
import * as signalR                             from '@aspnet/signalr';
import { OidcSecurityService }                  from 'angular-auth-oidc-client';

import { Configuration }                        from '../app.constants';
import { NewsItem }                             from '../models/news-item';
import * as NewsActions                         from '../root-store/news/actions';

@Injectable()
export class NewsService {
  private _hubConnection: signalR.HubConnection | undefined;
  private actionUrl: string;
  private headers: HttpHeaders;

  isAuthorizedSubscription: Subscription;
  isAuthorized = false;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.actionUrl = `${this.configuration.Server}api/news`;

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json' );
    this.headers = this.headers.set('Accept', 'application/json' );

    this.init();
  }

  send(newsItem: NewsItem): NewsItem {
    if (this._hubConnection) this._hubConnection.invoke('Send', newsItem);
    return newsItem;
  }

  // sendDirectMessage(message: string, userId: string): string {
  //   if (this._hubConnection) this._hubConnection.invoke('SendDM', message, userId);
  //   return message;
  // }

  joinGroup(group: string): void {
    if (this._hubConnection) this._hubConnection.invoke('JoinGroup', group);
  }

  leaveGroup(group: string): void {
    if (this._hubConnection) this._hubConnection.invoke('LeaveGroup', group);
  }

  getAllGroups(): Observable<string[]> {
    const token = this.oidcSecurityService.getToken();
    console.log('getAllGroups token: ' + token);
    if (token !== '') {
      const tokenValue = `Bearer ${token}`;
      this.headers = this.headers.append('Authorization', tokenValue);
    }

    return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
  }

  private init() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
      if (this.isAuthorized) this.initHub();
    });
    console.log('IsAuthorized:' + this.isAuthorized);
  }

  private initHub() {
    console.log('initHub');
    const token = this.oidcSecurityService.getToken();
    let tokenValue = '';
    if (token !== '') tokenValue = `?token=${token}`;

    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.configuration.Server}looney${tokenValue}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err => console.error(err));

    this._hubConnection.on('Send', (newsItem: NewsItem) => {
      this.store.dispatch(new NewsActions.ReceivedItemAction(newsItem));
    });

    this._hubConnection.on('JoinGroup', (data: string) => {
      console.log('received data from the hub');
      console.log(data);
      this.store.dispatch(new NewsActions.ReceivedGroupJoinedAction(data));
    });

    this._hubConnection.on('LeaveGroup', (data: string) => {
      this.store.dispatch(new NewsActions.ReceivedGroupLeftAction(data));
    });

    this._hubConnection.on('History', (newsItems: NewsItem[]) => {
      console.log('recieved history from the hub');
      console.log(newsItems);
      this.store.dispatch(new NewsActions.ReceivedGroupHistoryAction(newsItems));
    });
  }
}
