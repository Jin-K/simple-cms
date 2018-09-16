import { ModuleWithProviders }      from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { HomeComponent }            from './containers/home/home.component';
import { CanActivateViaAuthGuard }  from './core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'entity',
    loadChildren: './root-store/entidad/entidad.module#EntidadModule',
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: 'chat',
    loadChildren: './root-store/chat/chat.module#ChatModule'
  },
  {
    path: 'news',
    loadChildren: './root-store/news/news.module#NewsModule'
  },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
