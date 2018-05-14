import { Component, OnInit, OnDestroy }                   from '@angular/core';
import { HubConnectionBuilder, LogLevel, HubConnection }  from '@aspnet/signalr';

const ENDPOINT = 'http://simple-crm:64907';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
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
