import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatSelectModule, MatTooltipModule, MatButtonModule, MatPaginatorModule, MatOptionModule, MatSortModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { PaginationService } from './pagination.service';
import { PaginatorComponent } from './pagination.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule
  ],
  declarations: [
    PaginatorComponent
  ],
  providers: [
    PaginationService
  ],
  exports: [
    PaginatorComponent,
    MatSortModule
  ]
})
export class PaginationModule { }
