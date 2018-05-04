import { 
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule
}                           from '@angular/material';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';


@NgModule({
  imports: [ MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule ],
  exports: [ MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule ]
})

export class MaterialModule {}