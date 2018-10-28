import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { AnalyticsDashboardComponent } from './analytics/analytics.component';
import { ProjectDashboardComponent } from './project/project.component';
import { DashboardService } from './dashboard.service';
import { AnalyticsDashboardService } from './analytics/analytics.service';

const routes: Routes = [
  {
    path     : 'analytics',
    component: AnalyticsDashboardComponent,
    resolve  : {
        data: AnalyticsDashboardService
    }
  },
  {
    path     : 'project',
    component: ProjectDashboardComponent,
    // resolve  : {
    //     data: ProjectDashboardService
    // }
  }
];

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    ProjectDashboardComponent
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
