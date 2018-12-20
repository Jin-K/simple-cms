import { DataSource }                             from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter
}                                                 from '@angular/core';
import { FormGroup }                              from '@angular/forms';
import { MatDialogRef, MatDialog, MatSort, Sort } from '@angular/material';
import { Subject, Observable }                    from 'rxjs';
import { takeUntil }                              from 'rxjs/operators';

import { fuseAnimations }                         from '@fuse/animations';
import { FuseConfirmDialogComponent }             from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EntityService }                          from '../../entity.service';
import { EntityItemsListItemFormDialogComponent } from '../entity-items-list-item-form/entity-items-list-item-form.component';

@Component({
  selector: 'entity-items-list-details',
  templateUrl: './entity-items-list-details.component.html',
  styleUrls: ['./entity-items-list-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EntityItemsListDetailsComponent implements OnInit, OnDestroy {

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
  displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle', 'company', 'buttons'];
  selecteditems: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {EntityService} _entityService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _entityService: EntityService,
    public _matDialog: MatDialog
  ) {

    // set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // instantiate data source
    this.dataSource = new FilesDataSource(this._entityService);

    // listen to onItemsChanged
    this._entityService.onItemsChanged

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe(items => {

        // save items
        this.items = items;

        // uncheck all checkboxes
        this.checkboxes = {};
        items.map(item => this.checkboxes[item.id] = false);
      });

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

    // listen to onUserDataChanged
    this._entityService.onUserDataChanged

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe
      .subscribe(user => {

        // save user
        this.user = user;
      });

    // listen to onFilterChanged
    this._entityService.onFilterChanged

      // attach unsubscriber
      .pipe(takeUntil(this._unsubscribeAll))

      // subscribe to deselect all items of signal
      .subscribe(() => this._entityService.deselectItems());

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
  editItem(item): void {

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
   * @param {*} item item to delete
   * @memberof EntityItemsListDetailsComponent
   */
  deleteItem(item): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._entityService.deleteItem(item);
      }
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
   * @param itemId id of the item toggled star
   * @memberof EntityItemsListDetailsComponent
   */
  toggleStar(itemId): void {
    if (this.user.starred.includes(itemId)) {
      this.user.starred.splice(this.user.starred.indexOf(itemId), 1);
    }
    else {
      this.user.starred.push(itemId);
    }

    this._entityService.updateUserData(this.user);
  }

}

export class FilesDataSource extends DataSource<any> {

  /**
   * Constructor
   *
   * @param {EntityService} _entityService
   * @memberof FilesDataSource
   */
  constructor(
    private _entityService: EntityService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @memberof FilesDataSource
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {

    // bind to onItemsChanged subject of our entities service
    return this._entityService.onItemsChanged;
  }

  /**
   *
   * Disconnect
   *
   * @memberof FilesDataSource
   */
  disconnect(): void {}

}
