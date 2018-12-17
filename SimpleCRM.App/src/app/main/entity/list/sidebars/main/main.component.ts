import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject }                      from 'rxjs';
import { takeUntil }                    from 'rxjs/operators';
import { EntityService }                from 'app/main/entity/entity.service';

@Component({
  selector: 'entity-items-list-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  // public
  user: any;
  filterBy: string;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {EntityService} _entityService service for entities and entity items
   */
  constructor(
    private _entityService: EntityService
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // get filter from service or default 'all'
    this.filterBy = this._entityService.filterBy || 'all';

    // subscribe to user data changes
    this._entityService.onUserDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {

        // save user
        this.user = user;
      });
  }

  /**
   * On destroy
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
   * Change the filter
   *
   * @param filter
   */
  changeFilter(filter): void {

    // save filter
    this.filterBy = filter;

    // trigger the next event
    this._entityService.onFilterChanged.next(this.filterBy);
  }

}
