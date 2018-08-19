import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { StoreModule }        from '@ngrx/store';
import { EffectsModule }      from '@ngrx/effects';

import { entityReducer }      from './reducer';
import { SharedModule }       from '../../shared/shared.module';

import { EntidadEffects }     from './effects';
import { EntidadRoutes }      from './routes';
import { EntidadComponent }   from '../../containers/entidad/entidad.component';
import { ItemListComponent }  from '../../containers/entidad/item-list/item-list.component';
import { EntidadService }     from '../../services/entidad.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntidadRoutes,
    StoreModule.forFeature('entidad', entityReducer),
    EffectsModule.forFeature([EntidadEffects])
  ],
  declarations: [
    EntidadComponent,
    ItemListComponent
  ],
  providers: [EntidadService]
})
export class EntidadModule { }
