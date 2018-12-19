import { NgModule }                     from '@angular/core';
import { Routes, RouterModule }         from '@angular/router';
import { ChartsModule }                 from 'ng2-charts';

import { FuseSharedModule }             from '@fuse/shared.module';
import { AnalyticsDashboardComponent }  from './analytics/analytics.component';
import { DashboardService }             from './dashboard.service';
import { AnalyticsDashboardService }    from './analytics/analytics.service';

/**
 * Routes for the dashboard module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const routes: Routes = [

  /**
   * @name /apps/analytics
   * Show analytics.
   * Is actually the default route for the application. @see AppModule routes
   */
  {
    path     : 'analytics',
    component: AnalyticsDashboardComponent,
    resolve  : {
      data: AnalyticsDashboardService
    }
  },

];

/**
 * The main DashboardsModule class.
 *
 * @export
 * @class DashboardsModule
 */
@NgModule({
  declarations: [
    AnalyticsDashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    ChartsModule,

    FuseSharedModule
  ],
  providers: [
    DashboardService,
    AnalyticsDashboardService
  ]
})
export class DashboardsModule { }
