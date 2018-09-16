import { Routes, RouterModule }   from '@angular/router';
import { ListOverviewComponent }  from '../../containers/entidad/list-overview/list-overview.component';
import { EntidadesGuard }         from './guards/entidades-can-activate.guard';
//  import { PaginationResolver }   from './guards/pagination.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Contacts',
    pathMatch: 'full'
  },
  {
    path: ':entity',
    component: ListOverviewComponent,
    canActivate: [EntidadesGuard],
    //  resolve: {
    //    pagination: PaginationResolver
    //  },
  },
];

export const EntidadRoutes = RouterModule.forChild(routes);
