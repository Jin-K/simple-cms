import { Component, OnInit, OnDestroy, Input }            from '@angular/core';
import { Store, select }                                  from '@ngrx/store';
import { Observable }                                     from 'rxjs';

import { ElementsState, entityActions, entitySelectors }  from 'app/main/entity/store';

@Component({
  selector: 'entity-items-list-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
// export class MainComponent implements OnInit, OnDestroy {
export class MainComponent implements OnInit {

  @Input() entity: string;

  // public
  // user: any;
  // filterBy: string;
  filterBy$: Observable<string>;
  userName$: Observable<string>;

  /**
   * Constructor
   *
   * @param {EntityService} _entityService service for entities and entity items
   */
  constructor(
    private _store: Store<ElementsState>
  ) {

    // get username from store
    this.userName$ = this._store.pipe(select(entitySelectors.getCurrentDisplayName));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // get filter from store or default 'all'
    this.filterBy$ = this._store.pipe(select(entitySelectors.getCurrentFiltersCategory));

    // // subscribe to user data changes
    // this._entityService.onUserDataChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(user => {

    //     // save user
    //     this.user = user;
    //   });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Change the filter
   *
   * @param filter
   */
  changeFilter(filter): void {

    // change filter in store
    this._store.dispatch(new entityActions.ChangeFilter( this.entity, { category: filter } ));
  }

}
