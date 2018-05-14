import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';

import { StoreModule }      from '@ngrx/store';
import { EffectsModule }    from '@ngrx/effects';

import { newsReducer }      from './store/news.reducer';
import { NewsEffects }      from './store/news.effects';
import { NewsService }      from './services/news.service';

import { NewsRoutes }       from './news.routes';

import { NewsComponent }    from './components/news.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NewsRoutes,
    StoreModule.forFeature('news', newsReducer),
    EffectsModule.forFeature([NewsEffects])
  ],
  declarations: [NewsComponent],
  providers: [
    NewsService
  ],
  exports: [
    NewsComponent
  ]
})
export class NewsModule { }
