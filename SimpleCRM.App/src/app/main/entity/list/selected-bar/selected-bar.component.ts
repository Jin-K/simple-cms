import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef }      from '@angular/material';
import { Subject }                      from 'rxjs';
import { takeUntil }                    from 'rxjs/operators';

import { FuseConfirmDialogComponent }   from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { EntityService }                from '../../entity.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent implements OnInit, OnDestroy {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedItems: boolean;
  isIndeterminate: boolean;
  selectedItems: string[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Creates an instance of SelectedBarComponent.
   *
   * @param {EntityService} _entityService is replacing _itemsService in skeleton sample of @fuse
   * @param {MatDialog} _matDialog angular material dialog
   * @memberof SelectedBarComponent
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

    // subscribe to item's selection changes
    this._entityService.onSelectedItemsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedItems => {
        this.selectedItems = selectedItems;
        setTimeout(() => {
          this.hasSelectedItems = selectedItems.length > 0;
          this.isIndeterminate = (selectedItems.length !== this._entityService.items.length && selectedItems.length > 0);
        }, 0);
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
   * Select all
   */
  selectAll(): void {

    // select items
    this._entityService.selectItems();
  }

  /**
   * Deselect all
   */
  deselectAll(): void {

    // deselect items
    this._entityService.deselectItems();
  }

  /**
   * Delete selected items
   */
  deleteSelectedItems(): void {

    // open fuse confirm dialog and save ref
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    // change confirm message of confirm dialog
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected items?';

    // subscribe to confirm dialog close
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {

        // delete selected item if there is a result
        if (result) {
          this._entityService.deleteSelectedItems();
        }

        // remove reference to closed confirm dialog
        this.confirmDialogRef = null;
      });
  }

}
