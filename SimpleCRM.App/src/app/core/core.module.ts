import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { RouterModule }     from '@angular/router';

import { ChatService }      from './services/chat.service';
import { HomeComponent }    from './containers/home/home.component';
import { UserModule }       from '../user/user.module';
import { SharedModule }     from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    FormsModule,
    RouterModule,
    UserModule,
  ],
  declarations: [ HomeComponent ],
  exports: [
    FormsModule
  ]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [ ChatService ]
    };
  }
}
