import { Component, OnInit, OnDestroy }                   from '@angular/core';
import { HubConnectionBuilder, HubConnection }            from '@aspnet/signalr';

const ENDPOINT = 'https://localhost:44385';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly connection: HubConnection = new HubConnectionBuilder().withUrl(`${ENDPOINT}/message`).build();

  ngOnInit(): void {
    this.connection.on('send', data => console.log(data));
    this.connection.start().then(() => console.log('Connected')).catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.connection.stop().catch(err => console.error(err));
  }

}
