import { Routes, RouterModule }   from '@angular/router';
import { EntidadesGuard }         from './guards/entidades-can-activate.guard';
import { ItemResolver }           from './guards/item.resolver';
import { ListOverviewComponent }  from '../../containers/entidad/list-overview/list-overview.component';
import { EntityConsultComponent } from '../../containers/entidad/entity-consult/entity-consult.component';
import { EntityEditComponent }    from '../../containers/entidad/entity-edit/entity-edit.component';

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
