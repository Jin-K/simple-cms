import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }        from './containers/home/home.component';
import { ChatComponent }        from './containers/chat/chat.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'entity', loadChildren: './root-store/entidad/entidad.module#EntidadModule' },
  { path: 'chat', component: ChatComponent },
  { path: 'news', loadChildren: './root-store/news/news.module#NewsModule' },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);