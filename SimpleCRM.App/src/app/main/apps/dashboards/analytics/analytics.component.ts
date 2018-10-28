import { Component, OnInit, OnDestroy, ViewEncapsulation }  from '@angular/core';
import { Subscription }                                     from 'rxjs';
import { fuseAnimations }                                   from '@fuse/animations';

import { DashboardService }                                 from '../dashboard.service';
import { AnalyticsDashboardService }                        from './analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {

  widgets: any;
  statsSubscription: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private analyticsDashboardService: AnalyticsDashboardService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    const widget1 = this.analyticsDashboardService.widgets[0];
    const widget2 = {
      data: [0, 10000],
      values: ['?', '?'],
      labels: [ 'CPU usage', 'Other processes' ],
      options: {
        tooltips: {enabled: false},
        hover: {mode: null}
      },

    };
    const widget7 = {
      scheme: {
        domain: [ "#4867d2", "#5c84f1" ]
      },
      devices: [
        { name: "Other processes", value: 92.8, change: -0.6 },
        { name: "CPU usage", value: 7.2, change: 0.8 }
      ]
    };
    this.widgets = { 
      widget1: {
        chartType: widget1.ChartType,
        colors: widget1.Colors,
        labels: widget1.Labels,
        options: widget1.Options
      },
      widget2,
      widget7
    };

    this.statsSubscription = this.dashboardService.statsSubj.subscribe(stat => {
      switch (stat.type) {
        case 'CPU':
          const raw = Math.round(stat.value * 100);
          this.widgets.widget2.data = [ raw, 10000 - raw ];
          this.widgets.widget2.values[0] = raw / 100;
          break;
        case 'Memory':
          this.widgets.widget2.values[1] = Math.round( (stat.value / (1024 * 1024)) * 100 ) / 100;
          break;
      }

    });
  }

  ngOnDestroy(): void {
    this.statsSubscription.unsubscribe();
    this.dashboardService.statsSubj.complete();
  }

}
