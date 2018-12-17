import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup }               from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef }        from '@angular/material';
import { Item }                                 from '../item.model';

@Component({
  selector: 'entity-items-list-item-form-dialog',
  templateUrl: './entity-items-list-item-form.component.html',
  styleUrls: ['./entity-items-list-item-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EntityItemsListItemFormDialogComponent {

  action: string;
  item: Item;
  itemForm: FormGroup;
  dialogTitle: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<EntityItemsListItemFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<EntityItemsListItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {

    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Item';
      this.item = _data.item;
    }
    else {
      this.dialogTitle = 'New Item';
      this.item = new Item({});
    }

    this.itemForm = this.createItemForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create item form
   *
   * @returns {FormGroup}
   */
  createItemForm(): FormGroup {

    // return formgroup
    return this._formBuilder.group({
      id: [this.item.id],
      name: [this.item.name],
      lastName: [this.item.lastName],
      avatar: [this.item.avatar],
      nickname: [this.item.nickname],
      company: [this.item.company],
      jobTitle: [this.item.jobTitle],
      email: [this.item.email],
      phone: [this.item.phone],
      address: [this.item.address],
      birthday: [this.item.birthday],
      notes: [this.item.notes]
    });
  }

}
