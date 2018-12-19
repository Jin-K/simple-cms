import { Component, OnInit, ViewEncapsulation, OnDestroy }    from '@angular/core';
import { FormGroup }                                          from '@angular/forms';
import { MatDialog }                                          from '@angular/material';
import { ActivatedRoute }                                     from '@angular/router';
import { Store }                                              from '@ngrx/store';
import { Observable, Subject }                                from 'rxjs';
import { takeUntil }                                          from 'rxjs/operators';

import { fuseAnimations }                                     from '@fuse/animations';
import { FuseSidebarService }                                 from '@fuse/components/sidebar/sidebar.service';
import { PaginationItemList }                                 from '@core/pagination';

import { IItem }                                              from 'app/models';
import { entityActions, entitySelectors }                     from '../store';
import { EntityService }                                      from '../entity.service';
import { EntityItemsListItemFormDialogComponent }             from './entity-items-list-item-form/entity-items-list-item-form.component';

/**
 * The main component to display an entity's list of items
 *
 * @export
 * @class EntityListComponent
 * @implements {OnInit}
 */
@Component({
  selector      : 'app-list',
  templateUrl   : './list.component.html',
  styleUrls     : ['./list.component.scss'],
  encapsulation : ViewEncapsulation.None,
  animations    : fuseAnimations
})
export class EntityListComponent implements OnInit, OnDestroy {

  /**
   * Name of the entity
   *
   * @type {string}
   * @memberof EntityListComponent
   */
  entity: string;

  /**
   * Observable of the pagination items to display
   *
   * @type {Observable<PaginationItemList<IItem>>}
   * @memberof EntityListComponent
   */
  paginationItems$: Observable<PaginationItemList<IItem>>;

  /**
   * TODELETE ref to dialog for creating new items
   *
   * @type {*}
   * @memberof EntityListComponent
   */
  dialogRef: any;

  /**
   * TODELETE if items are selected
   *
   * @type {boolean}
   * @memberof EntityListComponent
   */
  hasSelectedItems: boolean;

  /**
   * TODELETE subject to attach to all subscriptions
   *
   * @private
   * @type {Subject<any>}
   * @memberof EntityListComponent
   */
  private _unsubscribeAll: Subject<any> = new Subject();

  /**
   * Creates an instance of EntityListComponent
   *
   * @param {ActivatedRoute} route activated route
   * @param {FuseSidebarService} fuseSidebarService TODELETE service handling sidebars
   * @param {Store<any>} store the main store
   * @param {EntityService} entityService TODELETE service for entities and entity items
   * @param {MatDialog} matDialog TODELETE angular material's dialog
   * @memberof EntityListComponent
   */
  constructor(
    private route: ActivatedRoute,
    private fuseSidebarService: FuseSidebarService,
    private store: Store<any>,
    private entityService: EntityService,
    private matDialog: MatDialog
  ) {}

  /**
   * ngOnInit implementation
   *
   * @memberof EntityListComponent
   */
  ngOnInit(): void {

    // subscribe to route params
    this.route.params.subscribe(({entity}) => {

      // save entity name
      this.entity = entity;

      // trigger paginate()
      this.paginate();
    });

    // observe store to get pagination items to display
    this.paginationItems$ = this.store.select(entitySelectors.selectCurrentItems);

    this.entityService.onSelectedItemsChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(selectedItems => {
            this.hasSelectedItems = selectedItems.length > 0;
        });
  }

  /**
   * On destroy
   *
   * @memberof EntityListComponent
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  /**
   * Callback for click on a 'delete item' button
   *
   * @param {IItem} item item to delete
   * @memberof EntityListComponent
   */
  onDelete(item: IItem): void {

  }

  /**
   * Paginate using the store
   *
   * @memberof EntityListComponent
   */
  paginate(): void {

    // dispatch PAGINATE without paginate options
    this.store.dispatch(new entityActions.Paginate(this.entity));
  }

  /**
   * TODELETE New item
   *
   * @memberof EntityListComponent
   */
  newItem(): void {
    this.dialogRef = this.matDialog.open(EntityItemsListItemFormDialogComponent, {
        panelClass: 'contact-form-dialog',
        data      : {
            action: 'new'
        }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if ( !response ) return;

        this.entityService.updateItem(response.getRawValue());
      });
  }

  /**
   * TODELETE Toggle the sidebar
   *
   * @param {string} sidebarName name of the sidebar to toggle
   * @memberof EntityListComponent
   */
  toggleSidebar(sidebarName: string): void {

    // get specific sidebar from service and toggle
    this.fuseSidebarService.getSidebar( sidebarName ).toggleOpen();
  }

}
