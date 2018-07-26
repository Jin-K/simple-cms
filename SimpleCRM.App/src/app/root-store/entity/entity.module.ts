import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { StoreModule }      from '@ngrx/store';
import { entityReducer }    from './reducer';
import { SharedModule }     from '../../shared/shared.module';
import { EntityRoutes }     from './routes';
import { EntityComponent }  from '../../core/containers/entity/entity.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntityRoutes,
    StoreModule.forFeature('entity', entityReducer)
    // EffectsModule.forFeature([MyFeatureStoreEffects])
  ],
  declarations: [ EntityComponent ]
})
export class EntityModule { }
