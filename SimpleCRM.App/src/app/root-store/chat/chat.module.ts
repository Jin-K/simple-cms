import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { ChatRoutes }     from './routes';
import { SharedModule }   from '../../shared/shared.module';
import { ChatComponent }  from '../../containers/chat/chat.component';
import { ChatService }    from '../../services/chat.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutes
  ],
  declarations: [ChatComponent],
  providers: [ChatService]
})
export class ChatModule { }
