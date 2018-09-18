import { ModuleWithProviders }                  from '@angular/core';
import { Routes, RouterModule }                 from '@angular/router';

import { HomeComponent, UnauthorizedComponent } from './core/components';
import { AuthGuard }                            from './core/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'entity',
    loadChildren: './root-store/entidad/entidad.module#EntidadModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: './root-store/chat/chat.module#ChatModule'
  },
  {
    path: 'news',
    loadChildren: './root-store/news/news.module#NewsModule'
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
