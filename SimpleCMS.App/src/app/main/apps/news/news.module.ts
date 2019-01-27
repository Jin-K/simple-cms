import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsService } from './news.service';
import { NewsStoreModule } from './store/store.module';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
  {
    path      : '**',
    component : NewsComponent
  }
];

@NgModule({
  declarations: [NewsComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    NewsStoreModule
  ],
  providers: [
    NewsService
  ]
})
export class NewsModule { }
