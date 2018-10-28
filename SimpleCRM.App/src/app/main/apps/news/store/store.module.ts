import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { newsReducer as reducers } from './reducers';
import { effects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('news', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class NewsStoreModule { }
