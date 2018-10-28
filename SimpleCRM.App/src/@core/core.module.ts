import { NgModule, Optional, SkipSelf, ModuleWithProviders }  from '@angular/core';

import { CORE_CONFIG }                                        from './services';
import { CoreConfig }                                         from './types';
import { AuthModule }                                         from './main/auth';

@NgModule({
  imports: [ AuthModule ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) throw new Error('CoreModule is already loaded. Import it in the AppModule only!');
  }

  static forRoot(config: CoreConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide : CORE_CONFIG,
          useValue: config
        },
      ]
    };
  }
}
