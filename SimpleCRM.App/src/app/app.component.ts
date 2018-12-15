import { Component, Inject, OnDestroy, OnInit, Injector } from '@angular/core';
import { DOCUMENT }                                       from '@angular/common';
import { Platform }                                       from '@angular/cdk/platform';
import { takeUntil }                                      from 'rxjs/operators';
import { TranslateService }                               from '@ngx-translate/core';

import { FuseConfigService }                              from '@fuse/services/config.service';
import { FuseNavigationService }                          from '@fuse/components/navigation/navigation.service';
import { FuseSplashScreenService }                        from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService }                   from '@fuse/services/translation-loader.service';

import { AuthAppBase }                                    from '@core/auth';

import { navigation }                                     from './navigation/navigation';
import { locale as navigationEnglish }                    from './navigation/i18n/en';
import { locale as navigationFrench }                     from './navigation/i18n/fr';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AuthAppBase implements OnInit, OnDestroy {
  // Public
  fuseConfig: any;
  navigation: any;

  /**
   * Constructor
   *
   * @param {DOCUMENT} document
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseNavigationService} _fuseNavigationService
   * @param {FuseSplashScreenService} _fuseSplashScreenService A reference to this service is required even if it is not used in the component, the service's constructor needs to be executed
   * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
   * @param {Platform} _platform
   * @param {TranslateService} _translateService
   * @param {Injector} _injector required for AuthAppBase base class
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _fuseConfigService: FuseConfigService,
    private _fuseNavigationService: FuseNavigationService,
    _fuseSplashScreenService: FuseSplashScreenService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _translateService: TranslateService,
    private _platform: Platform,
    protected _injector: Injector
  ) {
    // call base constructor
    super();

    // Get default navigation
    this.navigation = navigation;

    // Register the navigation to the service
    this._fuseNavigationService.register('main', this.navigation);

    // Set the main navigation as our current navigation
    this._fuseNavigationService.setCurrentNavigation('main');

    // Add languages
    this._translateService.addLangs(['en', 'fr']);

    // Set the default language
    this._translateService.setDefaultLang('en');

    // Set the navigation translations
    this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationFrench);

    // Use a language
    this._translateService.use('en');

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix Start
     * ----------------------------------------------------------------------------------------------------
     */

    /**
     * If you are using a language other than the default one, i.e. Turkish in this case,
     * you may encounter an issue where some of the components are not actually being
     * translated when your app first initialized.
     *
     * This is related to ngxTranslate module and below there is a temporary fix while we
     * are moving the multi language implementation over to the Angular's core language
     * service.
     **/

    // Set the default language to 'en' and then back to 'tr'.
    // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
    // been selected and there is no way to force it, so we overcome the issue by switching
    // the default language back and forth.
    /**
     setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
     */

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix End
     * ----------------------------------------------------------------------------------------------------
     */

    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // call base method
    super.ngOnInit();

    // Subscribe to config changes
    this._fuseConfigService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config) => {

      this.fuseConfig = config;

      // Boxed
      if ( this.fuseConfig.layout.width === 'boxed' ) {
        this.document.body.classList.add('boxed');
      }
      else {
        this.document.body.classList.remove('boxed');
      }

      // Color theme - Use normal for loop for IE11 compatibility
      for ( let i = 0; i < this.document.body.classList.length; i++ ) {
        const className = this.document.body.classList[i];

        if ( className.startsWith('theme-') ) {
          this.document.body.classList.remove(className);
        }
      }

      this.document.body.classList.add(this.fuseConfig.colorTheme);
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // call base method
    super.ngOnDestroy();
  }
}
