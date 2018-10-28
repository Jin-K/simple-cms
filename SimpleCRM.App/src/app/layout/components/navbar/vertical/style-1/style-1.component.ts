import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router }                                      from '@angular/router';
import { Subject, Observable }                                        from 'rxjs';
import { filter, take, takeUntil }                                    from 'rxjs/operators';
import { Store }                                                      from '@ngrx/store';

import { FuseConfigService }                                          from '@fuse/services/config.service';
import { FuseNavigationService }                                      from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective }                              from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService }                                         from '@fuse/components/sidebar/sidebar.service';

import { AuthState, UserSelectors }                                   from '@core/auth';


@Component({
  selector: 'navbar-vertical-style-1',
  templateUrl: './style-1.component.html',
  styleUrls: ['./style-1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
  // Public
  fuseConfig: any;
  fusePerfectScrollbarUpdateTimeout: any;
  navigation: any;
  given_name$: Observable<string>;
  email$: Observable<string>;

  // Private
  private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseNavigationService} _fuseNavigationService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {Router} _router
   * @param {Store<AuthState>} _store
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseNavigationService: FuseNavigationService,
    private _fuseSidebarService: FuseSidebarService,
    private _router: Router,
    private _store: Store<AuthState>
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Get given name from store
    this.given_name$ = this._store.select(UserSelectors.getUserGivenName);
    this.email$ = this._store.select(UserSelectors.getUserEmail);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(FusePerfectScrollbarDirective)
  set directive(theDirective: FusePerfectScrollbarDirective) {
    if (!theDirective) return;

    this._fusePerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this._fuseNavigationService.onItemCollapseToggled
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
            this._fusePerfectScrollbar.update();
          }, 310);
        });

    // Scroll to the active item position
    this._router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          setTimeout(() => {
            const activeNavItem: any = document.querySelector('navbar .nav-link.active');

            if (activeNavItem) {
              const activeItemOffsetTop = activeNavItem.offsetTop,
                activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

              this._fusePerfectScrollbar.scrollToTop(scrollDistance);
            }
          });
        });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe(() => {
          if (this._fuseSidebarService.getSidebar('navbar')) {
            this._fuseSidebarService.getSidebar('navbar').close();
          }
        });

    // Subscribe to the config changes
    this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
          this.fuseConfig = config;
        });

    // Get current navigation
    this._fuseNavigationService.onNavigationChanged
        .pipe(
          filter(value => value !== null),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe(() => {
          this.navigation = this._fuseNavigationService.getCurrentNavigation();
        });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.fusePerfectScrollbarUpdateTimeout) {
      clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
    }

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._fuseSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._fuseSidebarService.getSidebar('navbar').toggleFold();
  }
}
