import { Routes, RouterModule } from '@angular/router';
import { EntidadComponent }      from '../../containers/entidad/entidad.component';

const routes: Routes = [
  { path: '', component: EntidadComponent, pathMatch: 'full' }
];

export const EntidadRoutes = RouterModule.forChild(routes);
