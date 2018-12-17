import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule }     from '@fuse/shared.module';

/**
 * Routes for the main apps module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const routes: Routes = [

  /**
   * @name /apps/dashboards
   * Lazy load DashboardsModule
   */
  {
    path          : 'dashboards',
    loadChildren  : './dashboards/dashboards.module#DashboardsModule'
  },
  /**
   * @name /apps/chat
   * Lazy load ChatModule
   */
  {
    path          : 'chat',
    loadChildren  : './chat/chat.module#ChatModule'
  },

];


/**
 * The main AppsModule class.
 *
 * @export
 * @class AppsModule
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class AppsModule { }
