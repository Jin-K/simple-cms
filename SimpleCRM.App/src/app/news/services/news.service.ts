import { Injectable }                           from '@angular/core';
import { HttpHeaders, HttpClient }              from '@angular/common/http';
import { Observable }                           from 'rxjs';
import { Store }                                from '@ngrx/store';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
}                                               from '@aspnet/signalr';

import { NewsItem }                             from '../models/news-item';
import * as NewsActions                         from '../store/news.actions';

@Injectable()
export class NewsService {
  private _hubConnection: HubConnection | undefined;
  private actionUrl: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private store: Store<any>) {
    this.init();
    this.actionUrl = 'http://simple-crm:64907/api/news';

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json' );
    this.headers = this.headers.set('Accept', 'application/json' );
  }

  send(newsItem: NewsItem): NewsItem {
    if (this._hubConnection) this._hubConnection.invoke('Send', newsItem);
    return newsItem;
  }

  joinGroup(group: string): void {
    if (this._hubConnection) this._hubConnection.invoke('JoinGroup', group);
  }

  leaveGroup(group: string): void {
    if (this._hubConnection) this._hubConnection.invoke('LeaveGroup', group);
  }

  getAllGroups(): Observable<string[]> {
    return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
  }

  private init() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('http://simple-crm:64907/looney')
      .configureLogging(LogLevel.Information)
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
