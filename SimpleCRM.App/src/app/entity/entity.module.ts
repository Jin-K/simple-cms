import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { StoreModule }      from '@ngrx/store';

import { SharedModule }     from '../shared/shared.module';
import { entityReducer }    from './entity.reducer';
import { EntityComponent }  from './entity.component';
import { EntityRoutes }     from './entity.router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntityRoutes,
    StoreModule.forFeature('entity', entityReducer),
  ],
  declarations: [
    EntityComponent
  ]
})
export class EntityModule { }
