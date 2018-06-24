import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule }  from '@ngrx/store';

import { userReducer }  from './store/user.reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('user', userReducer)
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class UserModule { }
