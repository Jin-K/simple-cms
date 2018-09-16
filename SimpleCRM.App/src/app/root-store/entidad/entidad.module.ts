import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { StoreModule }            from '@ngrx/store';
import { EffectsModule }          from '@ngrx/effects';

import { entityReducer }          from './reducer';
import { EntidadesGuard }         from './guards/entidades-can-activate.guard';
import { EntidadEffects }         from './effects';
import { EntidadRoutes }          from './routes';

import { SharedModule }           from '../../shared/shared.module';
import { CoreModule }             from '../../core/core.module';
import { EntidadService }         from '../../services/entidad.service';
import { ListOverviewComponent }  from '../../containers/entidad/list-overview/list-overview.component';
import { ListComponent }          from '../../containers/entidad/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    CoreModule.forPagination(),
    EntidadRoutes,
    StoreModule.forFeature('entidad', entityReducer),
    EffectsModule.forFeature([EntidadEffects])
  ],
  declarations: [
    ListOverviewComponent,
    ListComponent
  ],
  providers: [
    EntidadService,
    EntidadesGuard
  ]
})
export class EntidadModule { }
