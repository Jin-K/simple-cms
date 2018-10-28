import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MailNgrxComponent } from './mail-ngrx.component';

const routes: Routes = [
  {
    path        : 'filter/:filterHandle',
    component   : MailNgrxComponent,
    // canAvtivate : [fromGuards.ResolveGuard]
  },
  {
    path        : '**',
    redirectTo  : 'inbox'
  }
];

@NgModule({
  declarations: [
    MailNgrxComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule
  ],
})
export class MailNgrxModule { }
