import { NgModule, ModuleWithProviders }        from '@angular/core';
import { FlexLayoutModule }                     from '@angular/flex-layout';
import { Configuration }                        from '../app.constants';
import { MaterialComponents } from './material.components';

@NgModule({
  imports: [
    ...MaterialComponents,
    FlexLayoutModule,
  ],
  declarations: [

  ],
  exports: [
    ...MaterialComponents,
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
