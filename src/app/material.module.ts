import { 
  MatButtonModule,
  MatCheckboxModule
}                           from '@angular/material';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';

@NgModule({
  imports: [ MatButtonModule, MatCheckboxModule ],
  exports: [ MatButtonModule, MatCheckboxModule ]
})

export class MaterialModule {}