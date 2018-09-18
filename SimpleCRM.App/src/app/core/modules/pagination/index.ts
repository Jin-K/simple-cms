import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import {
  MatFormFieldModule,
  MatSelectModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatButtonModule
}                             from '@angular/material';

import { PaginatorComponent } from './paginator/paginator.component';
import { PaginationService }  from './pagination.service';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  declarations: [
    PaginatorComponent
  ],
  providers: [
    PaginationService
  ],
  exports: [
    PaginatorComponent
  ]
})
export class PaginationModule { }

export { PaginationSettings }   from './pagination-settings.class';
export { PaginatorSelection }   from './paginator-selection.class';
export { ItemsSelectionState }  from './items-selection-state.enum';
export { PaginationModel }      from './pagination.model';
export { PaginationItemList }   from './pagination-items-list.type';
export { PaginationService };
