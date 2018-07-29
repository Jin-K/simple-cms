import { Routes, RouterModule } from '@angular/router';
import { EntidadComponent }      from '../../containers/entidad/entidad.component';

const routes: Routes = [
  { path: '', redirectTo: 'Contacts', pathMatch: 'full' },
  { path: ':entity', component: EntidadComponent }
];

export const EntidadRoutes = RouterModule.forChild(routes);
