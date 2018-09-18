import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { ChatRoutes }     from './routes';
import { SharedModule }   from '../../shared';
import { ChatComponent }  from './components/chat/chat.component';
import { ChatService }    from '../../core/services';

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
