import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }        from './core/containers/home/home.component';
import { ChatComponent }        from './chat/chat.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'entity', loadChildren: './entity/entity.module#EntityModule' },
  { path: 'chat', component: ChatComponent },
  { path: 'news', loadChildren: './news/news.module#NewsModule' },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
