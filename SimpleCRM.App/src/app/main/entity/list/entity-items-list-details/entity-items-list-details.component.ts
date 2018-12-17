import { DataSource }                                                               from '@angular/cdk/collections';
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, TemplateRef }  from '@angular/core';
import { FormGroup }                                                                from '@angular/forms';
import { MatDialogRef, MatDialog }                                                  from '@angular/material';
import { Subject, Observable }                                                      from 'rxjs';
import { takeUntil }                                                                from 'rxjs/operators';

import { fuseAnimations }                                                           from '@fuse/animations';
import { FuseConfirmDialogComponent }                                               from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EntityService }                                                            from '../../entity.service';
import { EntityItemsListItemFormDialogComponent }                                   from '../entity-items-list-item-form/entity-items-list-item-form.component';

@Component({
  selector: 'entity-items-list-details',
  templateUrl: './entity-items-list-details.component.html',
  styleUrls: ['./entity-items-list-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EntityItemsListDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  // public
  items: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle', 'buttons'];
  selecteditems: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
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
    this.dataSource = new FilesDataSource(this._entityService);

    this._entityService.onItemsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(items => {
        this.items = items;

        this.checkboxes = {};
        items.map(item => {
          this.checkboxes[item.id] = false;
        });
      });

    this._entityService.onSelectedItemsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selecteditems => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selecteditems.includes(id);
        }
        this.selecteditems = selecteditems;
      });

    this._entityService.onUserDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = user;
      });

    this._entityService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._entityService.deselectItems();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
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
   */
  editItem(item): void {
    this.dialogRef = this._matDialog.open(EntityItemsListItemFormDialogComponent, {
      panelClass: 'item-form-dialog',
      data: {
        item: item,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':

            this._entityService.updateItem(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteItem(item);

            break;
        }
      });
  }

  /**
   * Delete Item
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
   * @param itemId
   */
  onSelectedChange(itemId): void {
    this._entityService.toggleSelectedItem(itemId);
  }

  /**
   * Toggle star
   *
   * @param itemId
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

export class FilesDataSource extends DataSource<any>
{
  /**
   * Constructor
   *
   * @param {EntityService} _entityService
   */
  constructor(
    private _entityService: EntityService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._entityService.onItemsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }
}
