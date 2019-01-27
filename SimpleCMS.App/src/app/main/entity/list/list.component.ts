import { Component, OnInit, ViewEncapsulation }   from '@angular/core';
import { FormGroup }                              from '@angular/forms';
import { MatDialog, Sort, SortDirection }         from '@angular/material';
import { ActivatedRoute }                         from '@angular/router';
import { Store, select }                          from '@ngrx/store';
import { Observable, Subject }                    from 'rxjs';
import { map }                                    from 'rxjs/operators';

import { fuseAnimations }                         from '@fuse/animations';
import { FuseSidebarService }                     from '@fuse/components/sidebar/sidebar.service';

import { IItem }                                  from 'app/models';
import { entityActions, entitySelectors }         from '../store';
import { EntityService }                          from '../entity.service';
import { EntityItemsListItemFormDialogComponent } from './entity-items-list-item-form/entity-items-list-item-form.component';

/**
 * The main component to display an entity's list of items
 *
 * @export
 * @class EntityListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EntityListComponent implements OnInit {

  /**
   * Observable of order by options
   *
   * @type {Observable<{column: string, direction: SortDirection}>}
   * @memberof EntityListComponent
   */
  $orderBy: Observable<{column: string, direction: SortDirection}>;

  /**
   * Name of the entity
   *
   * @type {string}
   * @memberof EntityListComponent
   */
  entity: string;

  /**
   * TODELETE ref to dialog for creating new items
   *
   * @type {*}
   * @memberof EntityListComponent
   */
  dialogRef: any;

  /**
   * if items are selected
   *
   * @type {Observable<boolean>}
   * @memberof EntityListComponent
   */
  hasSelectedItems$: Observable<boolean>;

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
  ) {

    // get observable of order by properties
    this.$orderBy = this.store.pipe(

      // select current pagination options (depends on current entity ==> state.entity.current)
      select(entitySelectors.getCurrentPagination),

      // map to type { column: string, direction: SortDirection}
      map(pagination => {

        // split oderBy string and clear empty parts
        const orderByParts = (pagination.orderBy as string).split(' ', 2).filter( part => part && part !== ' ' );

        // get column
        const column = orderByParts[0];

        // get direction
        const direction = (orderByParts.length === 2 ? orderByParts[1] : '') as SortDirection;

        // return custom sort properties
        return { column, direction };
      })
    );

  }

  /**
   * ngOnInit implementation
   *
   * @memberof EntityListComponent
   */
  ngOnInit(): void {

    // subscribe to route params to watch entity name
    this.route.params.subscribe(({ entity }) => this.entity = this.onlyFirstLetterCapitalized(entity));

    // observe store to check if we have selected items
    this.hasSelectedItems$ = this.store.pipe(select(entitySelectors.getCurrentHasSelection));

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
   * Paginate (entity-items) using the store
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
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) return;

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
    this.fuseSidebarService.getSidebar(sidebarName).toggleOpen();

  }

  onChangeSort(sort: Sort): void {

    // dispatch pagination sort action
    this.store.dispatch(new entityActions.Sort(this.entity, sort.active, sort.direction));

  }

  /**
   * Util method to capitalize the first letter of a string and set the rest of the string to lower case.
   * TODO move it in a global utils file ?
   *
   * @param {string} str string to adapt
   * @returns {string} adapted string
   * @memberof EntityListComponent
   */
  private onlyFirstLetterCapitalized(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  }

}
