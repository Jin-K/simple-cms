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


/**
 * The main AppComponent class.
 * Main component: bootstrapped during initialization of the main app.module
 *
 * @export
 * @class AppComponent
 * @extends {AuthAppBase}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AuthAppBase implements OnInit, OnDestroy {

  /**
   * Available languages for the application
   *
   * @type {string[]}
   * @readonly
   * @memberof AppComponent
   */
  readonly langs: string[] = ['en', 'fr'];

  /**
   * Configuration object for Fuse
   *
   * @type {*}
   * @memberof AppComponent
   */
  fuseConfig: any;


  /**
   * Navigation object for Fuse's side navigation bar
   *
   * @type {*}
   * @memberof AppComponent
   */
  navigation: any;

  /**
   * Constructor
   *
   * @param {DOCUMENT} document
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseNavigationService} _fuseNavigationService
   * @param {FuseSplashScreenService} _fuseSplashScreenService A reference to this service is required
   *                                                          even if it is not used in the component,
   *                                                          the service's constructor needs to be executed
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

    // get default navigation
    this.navigation = navigation;

    // register the navigation to the service
    this._fuseNavigationService.register('main', this.navigation);

    // set the main navigation as our current navigation
    this._fuseNavigationService.setCurrentNavigation('main');

    // add languages
    this._translateService.addLangs(this.langs);

    // set the navigation translations
    this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationFrench);

    // set and use default language
    this.setAndUseLang('fr');

    // add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

  }

  /**
   * On initialisation
   *
   * @memberof AppComponent
   */
  ngOnInit(): void {

    // call base method
    super.ngOnInit();

    // subscribe to config changes
    this._fuseConfigService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config) => {

      this.fuseConfig = config;

      // boxed
      if ( this.fuseConfig.layout.width === 'boxed' ) this.document.body.classList.add('boxed');
      else                                            this.document.body.classList.remove('boxed');

      // color theme - Use normal for loop for IE11 compatibility
      for ( let i = 0; i < this.document.body.classList.length; i++ ) {

        // get class name
        const className = this.document.body.classList[i];

        // remove class if it starts with 'theme-'
        if ( className.startsWith('theme-') ) {
          this.document.body.classList.remove(className);
        }

      }

      // add color theme class to body
      this.document.body.classList.add(this.fuseConfig.colorTheme);
    });

  }


  /**
   * On destroy
   *
   * @memberof AppComponent
   */
  ngOnDestroy(): void {

    // call base method
    super.ngOnDestroy();

  }

  private setAndUseLang(language: string) {

    // if multiple languages set the default language
    if (this.langs.length > 1) {

      // with workaround
      setTimeout(() => {

        // get other language
        const otherLanguage = this.langs.find(l => l !== language);

        this._translateService.setDefaultLang(otherLanguage);
        this._translateService.setDefaultLang(language);
      });
    }

    // Use a language
    this._translateService.use(language);

  }

}
