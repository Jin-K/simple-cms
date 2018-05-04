import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { AppComponent } from './app.component';


/**
 * Main Module
 * -------------------------------------------
 * Things to know:
 *    BrowserAnimationsModule¹: 
 *      WebAnimation API isn't supported by all browsers.  If you want to support Material component animations in these browsers, you'll have to include a polyfill( https://github.com/web-animations/web-animations-js )
 *      If you don't want to add another dependency to your project, you can use the NoopAnimationsModule
 *    MatxxxxxxModule¹: 
 *      Material Modules (and/or components) to use in our app
 *      TODO: Isolate Material importations in an appart shared module
 * 
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


/**
 * References:
 *  1: https://material.angular.io/guide/getting-started
 */