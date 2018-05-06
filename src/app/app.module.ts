/**
 * AppModule
 * -------------------------------------------
 * Things to know:
 *    BrowserAnimationsModule¹: 
 *      WebAnimation API isn't supported by all browsers.  If you want to support Material component animations in these browsers, you'll have to include a polyfill( https://github.com/web-animations/web-animations-js )
 *      If you don't want to have animations in your project, you should replace BrowserAnimationsModule by NoopAnimationsModule
 *    MatxxxxxxModule¹: 
 *      Material Modules (and/or components) to use in our app
 */

import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations'
import { FormsModule }              from '@angular/forms';
import { FlexLayoutModule }         from '@angular/flex-layout';

import { AppComponent }             from './app.component';
import { Routing }                  from './app.routing';
import { MaterialModule }           from './material.module';
import { HomeComponent }            from './home/home.component';
import { EntityComponent }          from './entity/entity.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EntityComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    Routing
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


/**
 * References:
 *  1: https://material.angular.io/guide/getting-started
 */