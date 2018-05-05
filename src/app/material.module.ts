import { 
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCardModule,
  MatIconModule,
  MatSidenavModule
}                           from '@angular/material';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';


@NgModule({
  imports: [ MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule, MatIconModule, MatSidenavModule ],
  exports: [ MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule, MatIconModule, MatSidenavModule ]
})

export class MaterialModule {}