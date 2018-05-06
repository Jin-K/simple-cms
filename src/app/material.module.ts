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


@NgModule({
  imports: [ MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule, MatIconModule, MatSidenavModule, MatTabsModule ],
  exports: [ MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule, MatIconModule, MatSidenavModule, MatTabsModule ]
})

export class MaterialModule {}