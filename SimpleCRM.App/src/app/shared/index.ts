import { CommonModule }                     from '@angular/common';
import { NgModule, ModuleWithProviders }    from '@angular/core';
import { FlexLayoutModule }                 from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }                     from '@angular/router';

import { Configuration }                    from '../app.constants';
import { MaterialComponents }               from './material.components';
import { NavigationComponent }              from './components/navigation/navigation.component';
import { TopbarComponent }                  from './components/topbar/topbar.component';
import { BasicFormComponent }               from './components/basic-form/basic-form.component';
import { NestedFormComponent }              from './components/nested-form/nested-form.component';
import { ArrayFormComponent }               from './components/array-form/array-form.component';
import { ValidationFormComponent }          from './components/validation-form/validation-form.component';
import { EntityEditFormComponent }          from './components/entity-edit-form/entity-edit-form.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ...MaterialComponents,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  declarations: [
    NavigationComponent,
    TopbarComponent,
    BasicFormComponent,
    NestedFormComponent,
    ArrayFormComponent,
    ValidationFormComponent,
    EntityEditFormComponent
  ],
  exports: [
    // components
    ...MaterialComponents,
    NavigationComponent,
    TopbarComponent,
    BasicFormComponent,
    NestedFormComponent,
    ArrayFormComponent,
    ValidationFormComponent,
    EntityEditFormComponent,
    // modules
    FlexLayoutModule,
    ReactiveFormsModule
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
