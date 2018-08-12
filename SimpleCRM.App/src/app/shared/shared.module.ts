import { CommonModule }                   from '@angular/common';
import { NgModule, ModuleWithProviders }  from '@angular/core';
import { FlexLayoutModule }               from '@angular/flex-layout';
import { FormsModule }                    from '@angular/forms';
import { RouterModule }                   from '@angular/router';

import { Configuration }                  from '../app.constants';
import { MaterialComponents }             from './material.components';
import { NavigationComponent }            from './components/navigation/navigation.component';
import { TopbarComponent }                from './components/topbar/topbar.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ...MaterialComponents,
    FlexLayoutModule
  ],
  declarations: [
    NavigationComponent,
    TopbarComponent
  ],
  exports: [
    ...MaterialComponents,
    FlexLayoutModule,
    NavigationComponent,
    TopbarComponent
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
