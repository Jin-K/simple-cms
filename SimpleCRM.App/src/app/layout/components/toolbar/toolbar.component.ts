import { Component, OnDestroy, OnInit, ViewEncapsulation }  from '@angular/core';
import { Store }                                            from '@ngrx/store';
import { TranslateService }                                 from '@ngx-translate/core';
import { Subject, Observable }                              from 'rxjs';
import { takeUntil }                                        from 'rxjs/operators';

import { FuseSidebarService }                               from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService }                                from '@fuse/services/config.service';
import { FuseTranslationLoaderService }                     from '@fuse/services/translation-loader.service';
import * as fromAuthStore                                   from '@core/auth';

import * as fromStore                                       from 'app/store';
import { navigation }                                       from 'app/navigation/navigation';
import { locale as english }                                from './i18n/en';
import { locale as french }                                 from './i18n/fr';

import * as _                                               from 'lodash';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {

  // public
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];
  given_name$: Observable<string>;
  isAuthorized$: Observable<boolean>;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService fuse config service
   * @param {FuseSidebarService} _fuseSidebarService fuse sidebar service
   * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService fuse translation service
   * @param {TranslateService} _translateService core translation service
   * @param {Store<fromAuthStore.AuthState>} _store our auth store (store/auth)
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _translateService: TranslateService,
    private _store: Store<fromAuthStore.AuthState>
  ) {

    // set the defaults
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];

    this.languages = [
      {
        id: 'en',
        title: 'English',
        flag: 'us'
      },
      {
        id: 'fr',
        title: 'Français',
        flag: 'fr'
      }
    ];

    // set navigation
    this.navigation = navigation;

    // set the private defaults
    this._unsubscribeAll = new Subject();

    // get given name from store
    this.given_name$ = this._store.select(fromAuthStore.UserSelectors.getUserGivenName);

    // get "is authorized" from store
    this.isAuthorized$ = this._store.select(fromAuthStore.UserSelectors.getUserIsAuthorized);

    // load translations
    this._fuseTranslationLoaderService.loadTranslations(english, french);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On Init
   *
   * @memberof ToolbarComponent
   */
  ngOnInit(): void {

    // subscribe to the config changes
    this._fuseConfigService.config

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe((settings) => {

        // set local properties with values from fuse config settings
        this.horizontalNavbar = settings.layout.navbar.position === 'top';
        this.rightNavbar = settings.layout.navbar.position === 'right';
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });

    // set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });

  }

  /**
   * On destroy
   *
   * @memberof ToolbarComponent
   */
  ngOnDestroy(): void {

    // unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   * @memberof ToolbarComponent
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }

  /**
   * Search
   *
   * @param value
   */
  search(value): void {

    // do your search here...
    console.log(value);

  }

  /**
   * Set the language
   *
   * @param lang
   * @memberof ToolbarComponent
   */
  setLanguage(lang): void {

    // set the selected language for the toolbar
    this.selectedLanguage = lang;

    // use the selected language for translations
    this._translateService.use(lang.id);

  }

  /**
   * Log in
   *
   * @memberof ToolbarComponent
   */
  login(): void {

    // dispatch navigation action
    this._store.dispatch(new fromStore.Go({ path: ['/auth/login'] }));

  }

  /**
   * Log out
   *
   * @memberof ToolbarComponent
   */
  logout(): void {

    // dispatch navigation action
    this._store.dispatch(new fromAuthStore.SessionActions.SessionEnd());

  }

}
