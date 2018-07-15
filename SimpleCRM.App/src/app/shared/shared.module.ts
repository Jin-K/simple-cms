import { NgModule, ModuleWithProviders }  from '@angular/core';
import { FlexLayoutModule }               from '@angular/flex-layout';
import { MaterialModule }                 from '../material.module';
import { Configuration }                  from '../app.constants';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [

  ],
  exports: [
    FlexLayoutModule,
    MaterialModule
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
