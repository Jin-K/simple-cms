import { Injectable, OnDestroy }                from '@angular/core';
import { HttpHeaders, HttpClient }              from '@angular/common/http';
import { Store }                                from '@ngrx/store';
import * as signalR                             from '@aspnet/signalr';
import { Observable, Subject }                  from 'rxjs';
import { takeUntil }                            from 'rxjs/operators';
import { OidcSecurityService }                  from 'angular-auth-oidc-client';

import { UserSelectors }                        from '@core/auth';

import { coreConfig }                           from 'app/config';
import { NewsItem }                             from 'app/models/news-item.class';
import { State }                                from 'app/store';
import * as newsActions                         from './store/actions';

@Injectable()
export class NewsService implements OnDestroy {

  private readonly actionUrl: string;
  private readonly headers: HttpHeaders;
  private readonly _unsubscribeAll: Subject<any> = new Subject();

  private _hubConnection: signalR.HubConnection | undefined;

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.actionUrl = `${coreConfig.apiServer}/api/news`;

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
    return this.http.get<string[]>(this.actionUrl);
  }

  private init() {
    this.store.select(UserSelectors.getUserIsAuthorized)
        .pipe(takeUntil(this._unsubscribeAll))
        .filter(isAuthorized => isAuthorized)
        .subscribe(_ => this.initHub(this.oidcSecurityService.getToken()));
  }

  private initHub(token: string) {
    let tokenValue = `?token=${token}`;
    if (token !== '') tokenValue = `?token=${token}`;

    this._hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${coreConfig.apiServer}/looney${tokenValue}`)
        .configureLogging(signalR.LogLevel.Information)
        .build();

    this._hubConnection.start().catch(err => console.error(err));

    this._hubConnection.on('Send', (newsItem) => {
      this.store.dispatch(new newsActions.ReceivedItemAction(newsItem));
    });

    this._hubConnection.on('JoinGroup', (data: string) => {
      this.store.dispatch(new newsActions.ReceivedGroupJoinedAction(data));
    });

    this._hubConnection.on('LeaveGroup', (data: string) => {
      this.store.dispatch(new newsActions.ReceivedGroupLeftAction(data));
    });

    this._hubConnection.on('History', (newsItems) => {
      this.store.dispatch(new newsActions.ReceivedGroupHistoryAction(newsItems));
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
