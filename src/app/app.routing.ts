import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }        from './home/home.component';
import { EntityComponent }      from './entity/entity.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entity', component: EntityComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);