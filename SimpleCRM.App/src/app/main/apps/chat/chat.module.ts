import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path     : '**',
    component: ChatComponent,
    // resolve  : {
    //     chat: ChatService
    // }
  }
];

@NgModule({
  declarations: [ChatComponent],
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule
  ]
})
export class ChatModule { }
