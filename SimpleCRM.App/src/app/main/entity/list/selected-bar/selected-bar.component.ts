import { Component, OnInit, OnDestroy, Input }                  from '@angular/core';
import { MatDialog, MatDialogRef }                              from '@angular/material';
import { Store, select }                                        from '@ngrx/store';
import { FuseConfirmDialogComponent }                           from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject, Observable }                                  from 'rxjs';
import { map }                                                  from 'rxjs/operators';

import { entityActions, entitySelectors, ElementsState }        from '../../store';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent implements OnInit, OnDestroy {

  /**
   * Entity name of listed items
   *
   * @type {string}
   * @memberof SelectedBarComponent
   */
  @Input() entity: string;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  selectedItems$: Observable<number[]>;
  selectionCounters$: Observable<{selectionCount: number, totalCount: number}>;
  currentHasMoreThat100Selected$: Observable<boolean>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Creates an instance of SelectedBarComponent.
   *
   * @param {MatDialog} _matDialog angular material dialog
   * @param {Store<ElementsState>} _store elements store
   * @memberof SelectedBarComponent
   */
  constructor(
    public _matDialog: MatDialog,
    private _store: Store<ElementsState>
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

    this.selectedItems$ = this._store.pipe(
      select(entitySelectors.getCurrentViewModelSelection),
      map(selection => {
        const selectedItems = [] as number[];
        for (const x in selection)
          if (selection.hasOwnProperty(x) && selection[x] === true)
            selectedItems.push( +x );
        return selectedItems;
      })
    );

    this.selectionCounters$ = this._store.pipe(
      select(entitySelectors.getCurrentSelectionCounters)
    );

    this.currentHasMoreThat100Selected$ = this._store.pipe(select(entitySelectors.getCurrentHasMoreThat100Selected));
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
   *
   * @memberof SelectedBarComponent
   */
  selectAll(): void {

    // select items
    this._store.dispatch(new entityActions.SelectAll(this.entity));
  }

  /**
   * Deselect all
   *
   * @memberof SelectedBarComponent
   */
  deselectAll(): void {

    // deselect items
    this._store.dispatch(new entityActions.DeselectAll(this.entity));
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
          this._store.dispatch(new entityActions.DeleteSelectedItems(this.entity));
        }

        // remove reference to closed confirm dialog
        this.confirmDialogRef = null;
      });
  }

}
