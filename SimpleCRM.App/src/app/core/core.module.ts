import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule }      from '@angular/forms';
import { RouterModule }     from '@angular/router';

import { MaterialModule }   from '../material.module';

import { ChatService }      from './services/chat.service';
import { AppComponent }     from './containers/app.component';
import { HomeComponent }    from './containers/home/home.component';
import { Configuration }    from '../app.constants';
import { UserModule }       from '../user/user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    UserModule
  ],
  declarations: [ HomeComponent, AppComponent ],
  exports: [
    FormsModule,
    AppComponent,
    MaterialModule
  ]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [ ChatService, Configuration ]
    };
  }
}
