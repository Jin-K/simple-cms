import { NgModule }                     from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatRadioModule,
  MatSidenavModule,
  MatToolbarModule
}                                       from '@angular/material';
import { Routes, RouterModule }         from '@angular/router';

import { FuseSharedModule }             from '@fuse/shared.module';

import { ChatComponent }                from './chat.component';
import { ChatService }                  from './chat.service';
import { ChatContactSidenavComponent }  from './sidenavs/right/contact/contact.component';
import { ChatRightSidenavComponent }    from './sidenavs/right/right.component';
import { ChatLeftSidenavComponent }     from './sidenavs/left/left.component';
import { ChatUserSidenavComponent }     from './sidenavs/left/user/user.component';
import { ChatChatsSidenavComponent }    from './sidenavs/left/chats/chats.component';
import { ChatStartComponent }           from './chat-start/chat-start.component';
import { ChatViewComponent }            from './chat-view/chat-view.component';

/**
 * Routes for the chat module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const routes: Routes = [

  /**
   * @name /apps/chat
   * Base route
   */
  {
    path     : '**',
    component: ChatComponent,
    resolve  : {
      chat: ChatService
    }
  }

];

/**
 * The main ChatModule class
 *
 * @export
 * @class ChatModule
 */
@NgModule({
  declarations: [
    ChatComponent,
    ChatViewComponent,
    ChatStartComponent,
    ChatChatsSidenavComponent,
    ChatUserSidenavComponent,
    ChatLeftSidenavComponent,
    ChatRightSidenavComponent,
    ChatContactSidenavComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,

    FuseSharedModule
  ],
  providers : [
    ChatService
  ]
})
export class ChatModule { }
