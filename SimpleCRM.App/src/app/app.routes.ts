import { ModuleWithProviders }                  from '@angular/core';
import { Routes, RouterModule }                 from '@angular/router';

import { HomeComponent, UnauthorizedComponent } from './core/components';
import { AuthGuard }                            from './core/guards';
import { EntidadModule }                        from './root-store/entidad/entidad.module';
import { ChatModule }                           from './root-store/chat/chat.module';
import { NewsModule }                           from './root-store/news/news.module';

/** changed the way of calling lazy-loadable routes, because it didn't worked with ng serve
 *  ref: https://stackoverflow.com/a/46949676/7210166
 * */
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'entity',
    loadChildren: () => EntidadModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => ChatModule
  },
  {
    path: 'news',
    loadChildren: () => NewsModule
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
