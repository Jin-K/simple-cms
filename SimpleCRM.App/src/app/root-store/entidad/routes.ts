import { Routes, RouterModule }         from '@angular/router';
import { EntidadesGuard, ItemResolver } from './guards';
import {
  ListOverviewComponent,
  EntityConsultComponent,
  EntityEditComponent
}                                       from './components';

const routes: Routes = [
  { // if no matching route -> redirect to Contacts's items list
    path: '',
    redirectTo: 'Contacts',
    pathMatch: 'full'
  },
  { // consult item
    path: ':entity/consult/:id',
    component: EntityConsultComponent,
    resolve: { item: ItemResolver }
  },
  { // edit item
    path: ':entity/edit/:id',
    component: EntityEditComponent,
    resolve: { item: ItemResolver }
  },
  { // new item
    path: ':entity/edit',
    component: EntityEditComponent,
    resolve: { item: ItemResolver }
  },
  { // entity's items list
    path: ':entity',
    component: ListOverviewComponent,
    canActivate: [EntidadesGuard],
  },
];

export const EntidadRoutes = RouterModule.forChild(routes);
