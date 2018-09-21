import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { StoreModule }                  from '@ngrx/store';
import { EffectsModule }                from '@ngrx/effects';

import { entityReducer }                from './reducer';
import { EntidadesGuard, ItemResolver } from './guards';
import { EntidadEffects }               from './effects';
import { entidadRoutes }                from './routes';

import { SharedModule }                 from '../../shared';
import { PaginationModule }             from '../../core/modules/pagination';
import { EntidadService }               from '../../core/services';
import {
  ListOverviewComponent,
  ListComponent,
  EntityConsultComponent,
  EntityEditComponent,
  EntityEditDetailComponent,
  EntityConsultDetailComponent
}                                       from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    PaginationModule,
    entidadRoutes,
    StoreModule.forFeature('entidad', entityReducer),
    EffectsModule.forFeature([EntidadEffects])
  ],
  declarations: [
    ListOverviewComponent,
    ListComponent,
    EntityConsultComponent,
    EntityEditComponent,
    EntityEditDetailComponent,
    EntityConsultDetailComponent
  ],
  providers: [
    EntidadService,
    EntidadesGuard,
    ItemResolver
  ]
})
export class EntidadModule { }
