import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { StoreModule }      from '@ngrx/store';
import { entityReducer }    from './reducer';
import { SharedModule }     from '../../shared/shared.module';
import { EntidadRoutes }     from './routes';
import { EntidadComponent } from '../../containers/entidad/entidad.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntidadRoutes,
    StoreModule.forFeature('entity', entityReducer)
    // EffectsModule.forFeature([MyFeatureStoreEffects])
  ],
  declarations: [ EntidadComponent ]
})
export class EntidadModule { }
