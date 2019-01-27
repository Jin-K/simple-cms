import { NgModule }       from '@angular/core';
import { Error500Module } from './500/error-500.module';

/**
 * The main ErrorsModule class
 *
 * @export
 * @class ErrorsModule
 */
@NgModule({
  imports: [
    Error500Module
  ]
})
export class ErrorsModule { }
