import { DataSource }                                     from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input
}                                                         from '@angular/core';
import { FormGroup }                                      from '@angular/forms';
import { MatDialogRef, MatDialog, MatSort, Sort }         from '@angular/material';
import { Store, select }                                  from '@ngrx/store';
import { Subject, Observable }                            from 'rxjs';
import { takeUntil, tap, filter }                         from 'rxjs/operators';

import { fuseAnimations }                                 from '@fuse/animations';
import { FuseConfirmDialogComponent }                     from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { IItem }                                          from 'app/models';
import { EntityItemsListItemFormDialogComponent }         from '../entity-items-list-item-form/entity-items-list-item-form.component';
import { EntityService }                                  from '../../entity.service';
import { ElementsState, entitySelectors, entityActions }  from '../../store';
import { SelectionCheckboxState }                         from '../../store/selectors';

/**
 * The main EntityItemsListDetailsComponent class
 *
 * @export
 * @class EntityItemsListDetailsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'entity-items-list-details',
  templateUrl: './entity-items-list-details.component.html',
  styleUrls: ['./entity-items-list-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EntityItemsListDetailsComponent implements OnInit, OnDestroy {

  /**
   * Entity name of listed items
   *
   * @type {string}
   * @memberof EntityItemsListDetailsComponent
   */
  @Input() entity: string;

  /**
   * Sort options (orderby ==> column, direction)
   *
   * @type {Sort}
   * @memberof EntityItemsListDetailsComponent
   */
  @Input() orderBy: Sort;

  /**
   * Event emitter to transmit sort changes to parent component
   *
   * @type {EventEmitter<Sort>}
   * @memberof EntityItemsListDetailsComponent
   */
  @Output() changeSort = new EventEmitter<Sort>();

  /**
   * Our sort container
   *
   * @type {MatSort}
   * @memberof EntityItemsListDetailsComponent
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Our dialog content
   *
   * @type {TemplateRef<any>}
   * @memberof EntityItemsListDetailsComponent
   */
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  // public
  user: any;
  dataSource: StoreItemsDataSource | null;
  displayedColumns = ['checkbox', 'avatar', 'id', 'active', 'created', 'buttons'];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  checkboxState: SelectionCheckboxState;

  // private
  private _unsubscribeAll: Subject<any> = new Subject();

  /**
   * Constructor
   *
   * @param {EntityService} _entityService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _entityService: EntityService,
    public _matDialog: MatDialog,
    private _store: Store<ElementsState>
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // instantiate data source
    this.dataSource = new StoreItemsDataSource(this._store);

    // get current displayed items from store
    this._store.select(entitySelectors.getCurrentDisplayedItems).pipe(
      // attach unsubscriber
      takeUntil(this._unsubscribeAll),
      // if are defined
      filter(items => items !== undefined),
      // uncheck all checkboxes
      tap(items => items.map(item => (this.checkboxes = {}) && (this.checkboxes[item.id] = false)))
    ).subscribe();

    // get checkboxes model from store
    this._store.pipe(select(entitySelectors.getCurrentViewModelSelection))
      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))
      // subscribe and update this.checkboxes
      .subscribe(_checkboxes => this.checkboxes = _checkboxes);

    // // listen to onUserDataChanged
    // this._entityService.onUserDataChanged
    //   // attach unsubscriber
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   // subscribe to save user
    //   .subscribe(user => { console.log(user); this.user = user; });

    // listen to sort changes of the mat-table
    this.sort.sortChange
      // attach unsubscriber
      .takeUntil(this._unsubscribeAll)
      // emit to parent component
      .do(this.changeSort)
      // subscribe
      .subscribe();

    // subscribe to page selection checkbox state
    this._store.pipe(
      // get it from store
      select(entitySelectors.getCurrentPageSelectionCheckbox),
      // attach unsubscriber
      takeUntil(this._unsubscribeAll),
      // update this.checkboxState for view
      tap(_checkboxState => this.checkboxState = _checkboxState)
    ).subscribe();

  }

  /**
   * On destroy
   *
   * @memberof EntityItemsListDetailsComponent
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
   * Edit item
   *
   * @param {IItem} item
   * @memberof EntityItemsListDetailsComponent
   */
  editItem(item: IItem): void {

    // open edit item mat dialog and keep reference
    this.dialogRef = this._matDialog.open(EntityItemsListItemFormDialogComponent, {
      panelClass: 'item-form-dialog',
      data: {
        item: item,
        action: 'edit'
      }
    });

    // listen to afterClosed()
    this.dialogRef.afterClosed()

      // subscribe
      .subscribe(response => {

        // return if no response
        if (!response) return;

        // extract data from response
        const actionType: string = response[0];
        const formData: FormGroup = response[1];

        // switch action type
        switch (actionType) {

          /**
           * Save
           */
          case 'save':

            // update item via the entities service
            this._entityService.updateItem(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            // delete item via the entities service
            this.deleteItem(item);

            break;

        }
      });

  }

  toggleSelectDisplayedItems(): void {
    this._store.dispatch(new entityActions.ToggleDisplayedItems(this.entity));
  }

  /**
   * Delete item
   *
   * @param {IItem} item item to delete
   * @memberof EntityItemsListDetailsComponent
   */
  deleteItem(item: IItem): void {

    // open closeable dialog and save reference
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    // set confirm message for delete
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    // on close dialog
    this.confirmDialogRef.afterClosed().subscribe(result => {

      // delete item if result
      if (result) this._store.dispatch(new entityActions.DeleteItem(this.entity, item.id));

      // remove reference to dialog
      this.confirmDialogRef = null;
    });

  }

  /**
   * On selected change
   *
   * @param {number} itemId id of the selected item
   * @memberof EntityItemsListDetailsComponent
   */
  onSelectedChange(itemId: number): void {
    this._store.dispatch(new entityActions.ToggleOne(this.entity, itemId));
  }

  /**
   * Toggle star
   *
   * @param {number} itemId id of the item toggled star
   * @memberof EntityItemsListDetailsComponent
   */
  toggleStar(itemId: number): void {

    // if user's starred array contains that item id
    if (this.user.starred.includes(itemId)) {

      // remove from array
      this.user.starred.splice(this.user.starred.indexOf(itemId), 1);
    }
    else {

      // add to array
      this.user.starred.push(itemId);
    }

    // ask entity service to update user's data
    this._entityService.updateUserData(this.user);

  }

}

export class StoreItemsDataSource extends DataSource<IItem> {

  /**
   * Constructor
   *
   * @param {Store<ElementsState>} _store store for elements (entities, items)
   * @memberof StoreItemsDataSource
   */
  constructor(
    private _store: Store<ElementsState>
  ) {

    // invoke base constructor
    super();

  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @memberof StoreItemsDataSource
   * @returns {Observable<any[]>}
   */
  connect(): Observable<IItem[]> {

    // bind to an elements state selector
    return this._store.pipe(select(entitySelectors.getCurrentDisplayedItems));

  }

  /**
   * Disconnect implementation
   *
   * @memberof StoreItemsDataSource
   */
  disconnect(): void { }

}
