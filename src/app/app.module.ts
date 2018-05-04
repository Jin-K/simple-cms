/**
 * AppModule
 * -------------------------------------------
 * Things to know:
 *    BrowserAnimationsModule¹: 
 *      WebAnimation API isn't supported by all browsers.  If you want to support Material component animations in these browsers, you'll have to include a polyfill( https://github.com/web-animations/web-animations-js )
 *      If you don't want to add another dependency to your project, you can use the NoopAnimationsModule
 *    MatxxxxxxModule¹: 
 *      Material Modules (and/or components) to use in our app
 */

import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations'
import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { AppComponent }             from './app.component';
import { MaterialModule }           from './material.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


/**
 * References:
 *  1: https://material.angular.io/guide/getting-started
 */