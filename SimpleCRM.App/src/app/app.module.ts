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

const appRoutes: Routes = [
  {
    path          : 'apps',
    loadChildren  : './main/apps/apps.module#AppsModule'
  },
  {
    path          : 'entity',
    loadChildren  : './main/entity/entity.module#EntityModule',
    canActivate   : [AuthGuard]
  },
  {
    path          : '**',
    redirectTo    : 'apps/dashboards/analytics'
  },
];

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
