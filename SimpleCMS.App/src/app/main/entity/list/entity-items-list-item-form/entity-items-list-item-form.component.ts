import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup }               from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef }        from '@angular/material';

import { Item }                                 from '../item.model';
import { IItem }                                from 'app/models';

/**
 * The main EntityItemsListItemFormDialogComponent class
 *
 * @description dialog component for fast item edit in entity items lists
 * @export
 * @class EntityItemsListItemFormDialogComponent
 */
@Component({
  selector: 'entity-items-list-item-form-dialog',
  templateUrl: './entity-items-list-item-form.component.html',
  styleUrls: ['./entity-items-list-item-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EntityItemsListItemFormDialogComponent {

  // public
  action: string;
  item: IItem;
  item2: Item;
  itemForm: FormGroup;
  dialogTitle: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EntityItemsListItemFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   * @memberof EntityItemsListItemFormDialogComponent
   */
  constructor(
    public matDialogRef: MatDialogRef<EntityItemsListItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: {action: string, item: IItem},
    private _formBuilder: FormBuilder
  ) {

    // set the defaults
    this.action = _data.action;

    // edit or new ?
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Item';
      // this.item2 = _data.item;
      this.item = _data.item;
    }
    else {
      this.dialogTitle = 'New Item';
      // this.item2 = new Item({});
      this.item = { id: null, active: true, created: null};
    }

    // build item form
    // this.itemForm = this.createItemForm2();
    this.itemForm = this.createItemForm();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create item form
   *
   * @returns {FormGroup} form group containing all fields
   * @memberof EntityItemsListItemFormDialogComponent
   */
  createItemForm(): FormGroup {

    // return formgroup
    return this._formBuilder.group({
      active: [this.item.active]
    });

  }

  /**
   * Create item form 2
   *
   * @memberof EntityItemsListItemFormDialogComponent
   * @returns {FormGroup} form group containing all fields
   */
  createItemForm2(): FormGroup {

    // return formgroup
    return this._formBuilder.group({
      id: [this.item2.id],
      name: [this.item2.name],
      lastName: [this.item2.lastName],
      avatar: [this.item2.avatar],
      nickname: [this.item2.nickname],
      company: [this.item2.company],
      jobTitle: [this.item2.jobTitle],
      email: [this.item2.email],
      phone: [this.item2.phone],
      address: [this.item2.address],
      birthday: [this.item2.birthday],
      notes: [this.item2.notes]
    });

  }

}
