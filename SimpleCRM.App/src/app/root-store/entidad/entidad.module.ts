import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { StoreModule }      from '@ngrx/store';
import { EffectsModule }    from '@ngrx/effects';

import { entityReducer }    from './reducer';
import { SharedModule }     from '../../shared/shared.module';

import { EntidadEffects }   from './effects';
import { EntidadRoutes }    from './routes';
import { EntidadComponent } from '../../containers/entidad/entidad.component';
import { EntidadService }   from '../../services/entidad.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntidadRoutes,
    StoreModule.forFeature('entidad', entityReducer),
    EffectsModule.forFeature([EntidadEffects])
  ],
  declarations: [EntidadComponent],
  providers: [EntidadService]
})
export class EntidadModule { }
