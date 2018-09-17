import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { StoreModule }                  from '@ngrx/store';
import { EffectsModule }                from '@ngrx/effects';

import { entityReducer }                from './reducer';
import { EntidadesGuard }               from './guards/entidades-can-activate.guard';
import { ItemResolver }                 from './guards/item.resolver';
import { EntidadEffects }               from './effects';
import { EntidadRoutes }                from './routes';

import { SharedModule }                 from '../../shared/shared.module';
import { CoreModule }                   from '../../core/core.module';
import { EntidadService }               from '../../services/entidad.service';
import { ListOverviewComponent }        from '../../containers/entidad/list-overview/list-overview.component';
import { ListComponent }                from '../../containers/entidad/list/list.component';
import { EntityConsultComponent }       from '../../containers/entidad/entity-consult/entity-consult.component';
import { EntityEditComponent }          from '../../containers/entidad/entity-edit/entity-edit.component';
import { EntityEditDetailComponent }    from '../../containers/entidad/entity-edit-detail/entity-edit-detail.component';
import { EntityConsultDetailComponent } from '../../containers/entidad/entity-consult-detail/entity-consult-detail.component';

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
