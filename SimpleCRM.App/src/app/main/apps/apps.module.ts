import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path          : 'dashboards',
    loadChildren  : './dashboards/dashboards.module#DashboardsModule'
  },
  {
    path          : 'mail-ngrx',
    loadChildren  : './mail-ngrx/mail-ngrx.module#MailNgrxModule'
  },
  {
    path          : 'chat',
    loadChildren  : './chat/chat.module#ChatModule'
  },
  {
    path          : 'news',
    loadChildren  : './news/news.module#NewsModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class AppsModule { }
