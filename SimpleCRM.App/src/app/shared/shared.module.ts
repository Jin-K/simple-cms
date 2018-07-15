import { NgModule, ModuleWithProviders }  from '@angular/core';
import { FlexLayoutModule }               from '@angular/flex-layout';
import { Configuration }                  from '../app.constants';
import { MAT_COMPONENTS }                 from './material.components';

@NgModule({
  imports: [
    ...MAT_COMPONENTS,
    FlexLayoutModule,
  ],
  declarations: [

  ],
  exports: [
    ...MAT_COMPONENTS,
    FlexLayoutModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [Configuration]
    };
  }
}
