import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { AuthGuard }                from './guards';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    AuthGuard
  ]
})
export class CoreModule { }
