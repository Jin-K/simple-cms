import { NgModule, ModuleWithProviders }  from '@angular/core';
import { CommonModule }                   from '@angular/common';

import { SharedModule }                   from '../shared/shared.module';
import { PaginatorComponent }             from './components/paginator/paginator.component';
import { CanActivateViaAuthGuard }        from './guards/auth.guard';
import { PaginationService }              from './services/pagination.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    PaginatorComponent
  ],
  exports: [
    PaginatorComponent
  ],
  providers: [
    CanActivateViaAuthGuard
  ]
})
export class CoreModule {
  static forPagination(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [PaginationService]
    };
  }
}
