import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule }     from '@fuse/shared.module';
import { ChatComponent }        from './chat.component';
import { ChatService }          from './chat.service';

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
    ChatComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule
  ],
  providers : [
    ChatService
  ]
})
export class ChatModule { }
