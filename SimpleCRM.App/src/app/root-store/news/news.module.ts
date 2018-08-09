import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';

import { StoreModule }      from '@ngrx/store';
import { EffectsModule }    from '@ngrx/effects';

import { newsReducer }      from './reducer';
import { NewsEffects }      from './effects';
import { NewsService }      from '../../services/news.service';

import { NewsRoutes }       from './routes';

import { NewsComponent }    from '../../containers/news/news.component';

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
  ]
})
export class NewsModule { }
