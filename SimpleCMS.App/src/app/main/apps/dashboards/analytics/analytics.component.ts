import { Component, OnInit, OnDestroy, ViewEncapsulation }  from '@angular/core';
import { TranslateService, LangChangeEvent }                from '@ngx-translate/core';
import { Subject }                                          from 'rxjs';
import { takeUntil }                                        from 'rxjs/operators';

import { fuseAnimations }                                   from '@fuse/animations';
import { FuseTranslationLoaderService }                     from '@fuse/services/translation-loader.service';

import { DashboardService }                                 from '../dashboard.service';
import { locale as english }                                from './i18n/en';
import { locale as french }                                 from './i18n/fr';

/**
 * The main AnalyticsDashboardComponent class
 *
 * @export
 * @class AnalyticsDashboardComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {

  /**
   * Subject to unsubscribe from existing subscriptions.
   *
   * @protected
   * @type {Subject<any>}
   * @memberof AuthAppBase
   */
  protected _unsubscribeAll: Subject<any> = new Subject();

  /**
   * Widgets object
   *
   * @type {*}
   * @memberof AnalyticsDashboardComponent
   */
  widgets: any;

  /**
   * Constructor
   *
   * @param {DashboardService} dashboardService service to get server statistics
   * @param {FuseTranslationLoaderService} fuseTranslationLoaderService fuse service for translations
   * @param {TranslateService} translateService core service for translations
   * @memberof AnalyticsDashboardComponent
   */
  constructor(
    private dashboardService: DashboardService,
    private fuseTranslationLoaderService: FuseTranslationLoaderService,
    private translateService: TranslateService
  ) {

    // load translations with fuse
    this.fuseTranslationLoaderService.loadTranslations(english, french);
  }

  /**
   * The main ngOnInit method
   *
   * @memberof AnalyticsDashboardComponent
   */
  ngOnInit(): void {

    // wait for translated labels
    this.translateService.get( 'WIDGET1' )

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe( (translations: any) => {

        // build widget1
        const widget1 = {
          data: [0, 10000],
          values: ['?', '?'],
          labels: [ translations.COLOR_LABELS.API, translations.COLOR_LABELS.OTHER ],
          options: {
            tooltips: {enabled: false},
            hover: {mode: null}
          },
        };

        // build widgets
        this.widgets = {
          widget1
        };

      }
    );

    // on lang change
    this.translateService.onLangChange

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe((langChangeEvent: LangChangeEvent) => {

        // get translations for widget 1
        const translations = langChangeEvent.translations.WIDGET1;

        // change labels of widget 1
        this.widgets.widget1.labels = [translations.COLOR_LABELS.API, translations.COLOR_LABELS.OTHER ];

      }
    );

    // subscribe to metric changes from dashboard service
    this.dashboardService.statsSubj

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe(stat => {

        // filter on incoming data type
        switch (stat.type) {

          case 'CPU':

            // get raw percentage
            const raw = Math.round(stat.value * 100);

            // set cpu values on widget 1
            this.widgets.widget1.data = [ raw, 10000 - raw ];
            this.widgets.widget1.values[0] = raw / 100;

            break;

          case 'Memory':

            // set memory value on widget 1
            this.widgets.widget1.values[1] = Math.round( (stat.value / (1024 * 1024)) * 100 ) / 100;

            break;
        }

      }
    );

  }

  /**
   * The main ngOnDestroy method
   *
   * @memberof AnalyticsDashboardComponent
   */
  ngOnDestroy(): void {

    // unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }

}
