import { NgModule }                       from '@angular/core';
import { BrowserModule }                  from '@angular/platform-browser';
import { HttpClientModule }               from '@angular/common/http';
import { BrowserAnimationsModule }        from '@angular/platform-browser/animations';
import { RouterModule, Routes }           from '@angular/router';
import { MatMomentDateModule }            from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule }                from '@ngx-translate/core';

import {
  FuseProgressBarModule,
  FuseSidebarModule,
  FuseThemeOptionsModule
}                                         from '@fuse/components';
import { FuseSharedModule }               from '@fuse/shared.module';
import { FuseModule }                     from '@fuse/fuse.module';

import { CoreModule }                     from '@core/core.module';
import { AuthGuard }                      from '@core/guards';

import { fuseConfig, coreConfig }         from './config';
import { AppComponent }                   from './app.component';
import { LayoutModule }                   from './layout/layout.module';
import { AppStoreModule }                 from './store/store.module';

/**
 * Routes for the main app module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const appRoutes: Routes = [

  /**
   * @name /apps
   * Main route containing all apps
   */
  {
    path          : 'apps',
    loadChildren  : './main/apps/apps.module#AppsModule'
  },
  /**
   * @name /entity
   * Main route for entities and entity items (CRM)
   * Needs authorisation from AuthGuard
   */
  {
    path          : 'entity',
    loadChildren  : './main/entity/entity.module#EntityModule',
    canActivate   : [AuthGuard]
  },
  /**
   * @name /errors
   * Main route for error pages
   */
  {
    path          : 'errors',
    loadChildren  : './main/pages/errors/errors.module#ErrorsModule',
  },
  /**
   * @name /
   * Main default route
   * Any unmatching route in app matches to this one
   */
  {
    path          : '**',
    redirectTo    : 'apps/dashboards/analytics'
  },

];

/**
 * The main AppModule class.
 * 'FuseModule' and 'CoreModule' should be imported from here
 * via 'forRoot' with their respective configuration objects
 *
 * @description main module of our app
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports     : [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,

    // Material
    MatButtonModule,
    MatIconModule,

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    CoreModule.forRoot(coreConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    // App modules
    LayoutModule,
    AppStoreModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap   : [
    AppComponent
  ]
})
export class AppModule { }
