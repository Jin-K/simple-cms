import { Injectable, OnDestroy, OnInit }  from '@angular/core';
import * as signalR                       from '@aspnet/signalr';
import { Subject }                        from 'rxjs';
import { coreConfig }                     from 'app/config';

@Injectable()
export class DashboardService implements OnInit, OnDestroy {
  private _hubConnection: signalR.HubConnection | undefined;
  private _streamSubscription: signalR.ISubscription<any>;

  statsSubj: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${coreConfig.apiServer}/dashboard`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err => console.error(err));

    setTimeout(() => {
      this._streamSubscription = this._hubConnection.stream('Monitor').subscribe({
        next: this.statsSubj.next.bind(this.statsSubj),
        complete: () => console.log('complete'),
        error: console.error
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    this._streamSubscription.dispose();
  }

}
