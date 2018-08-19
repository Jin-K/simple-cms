import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent }    from '../../containers/entidad/item-list/item-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'Contacts', pathMatch: 'full' },
  { path: ':entity', component: ItemListComponent }
];

export const EntidadRoutes = RouterModule.forChild(routes);
