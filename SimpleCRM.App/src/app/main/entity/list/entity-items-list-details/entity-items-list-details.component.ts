import { DataSource }                             from '@angular/cdk/collections';
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
}                                                 from '@angular/core';
import { FormGroup }                              from '@angular/forms';
import { MatDialogRef, MatDialog, MatSort, Sort } from '@angular/material';
import { Store, select }                          from '@ngrx/store';
import { Subject, Observable }                    from 'rxjs';
import { takeUntil, tap, filter }                 from 'rxjs/operators';

import { fuseAnimations }                         from '@fuse/animations';
import { FuseConfirmDialogComponent }             from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { IItem }                                  from 'app/models';
import { EntityItemsListItemFormDialogComponent } from '../entity-items-list-item-form/entity-items-list-item-form.component';
import { EntityService }                          from '../../entity.service';
import { ElementsState, entitySelectors }         from '../../store';

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
  items: any;
  user: any;
  dataSource: FilesDataSource | null;
  // displayedColumns = ['checkbox', 'avatar', 'id', 'name', 'active', 'created', 'buttons'];
  displayedColumns = ['checkbox', 'avatar', 'id', 'active', 'created', 'buttons'];
  selecteditems: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    this.dataSource = new FilesDataSource(this._store);

    // get current displayed items from store
    this._store.select(entitySelectors.getCurrentDisplayedItems).pipe(
      // attach unsubscriber
      takeUntil(this._unsubscribeAll),
      // if are defined
      filter(items => items !== undefined),
      // uncheck all checkboxes
      tap(items => items.map(item => (this.checkboxes = {}) && (this.checkboxes[item.id] = false)))
    ).subscribe();

    // listen to onSelectedItemsChanged
    this._entityService.onSelectedItemsChanged
      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))
      // subscribe
      .subscribe(selecteditems => {
        // for each checkbox
        for (const id in this.checkboxes) {
          // assert id
          if (!this.checkboxes.hasOwnProperty(id)) continue;
          // check checkbox if in selected items
          this.checkboxes[id] = selecteditems.includes(id);
        }
        // save selected items
        this.selecteditems = selecteditems;
      });

    // // listen to onUserDataChanged
    // this._entityService.onUserDataChanged
    //   // attach unsubscriber
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   // subscribe to save user
    //   .subscribe(user => { console.log(user); this.user = user; });

    // listen to onFilterChanged
    this._entityService.onFilterChanged2
      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))
      // subscribe to deselect all items of signal
      // .subscribe(() => this._entityService.deselectItems());
      .subscribe(this._entityService.deselectItems.bind(this._entityService));

    // listen to sort changes of the mat-table
    this.sort.sortChange
      // attach unsubscriber
      .takeUntil(this._unsubscribeAll)
      // emit to parent component
      .do(this.changeSort)
      // subscribe
      .subscribe();

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
   * @param item
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

  /**
   * Delete item
   *
   * @param {any} item item to delete
   * @memberof EntityItemsListDetailsComponent
   */
  deleteItem(item: any): void {

    // open closeable dialog and save reference
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    // set confirm message for delete
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    // on close dialog
    this.confirmDialogRef.afterClosed().subscribe(result => {

      // delete item if result
      if (result) this._entityService.deleteItem(item);

      // remove reference to dialog
      this.confirmDialogRef = null;
    });

  }

  /**
   * On selected change
   *
   * @param itemId id of the selected item
   * @memberof EntityItemsListDetailsComponent
   */
  onSelectedChange(itemId): void {
    this._entityService.toggleSelectedItem(itemId);
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

export class FilesDataSource extends DataSource<IItem> {

  /**
   * Constructor
   *
   * @param {Store<ElementsState>} _store store for elements (entities, items)
   * @memberof FilesDataSource
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
   * @memberof FilesDataSource
   * @returns {Observable<any[]>}
   */
  connect(): Observable<IItem[]> {

    // bind to an elements state selector
    return this._store.pipe(select(entitySelectors.getCurrentDisplayedItems));

  }

  /**
   * Disconnect implementation
   *
   * @memberof FilesDataSource
   */
  disconnect(): void { }

}
