import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { entityReducer as reducers } from './reducers';
import { EntityEffects as entityEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('entity', reducers),
    EffectsModule.forFeature([entityEffects])
  ]
})
export class EntityStoreModule { }
