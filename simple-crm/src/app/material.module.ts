import {
  MatButtonModule,
  MatMenuModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCardModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule
}                           from '@angular/material';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';

const MAT_COMPONENTS = [
  MatButtonModule,
  MatMenuModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCardModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule
];

@NgModule({
  imports: MAT_COMPONENTS,
  exports: MAT_COMPONENTS
})

export class MaterialModule {}