import { Component, OnInit, Input }                  from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IItem } from '../../../core/models';

@Component({
  selector: 'app-entity-edit-form',
  templateUrl: './entity-edit-form.component.html',
  styleUrls: ['./entity-edit-form.component.scss']
})
export class EntityEditFormComponent implements OnInit {

  form: FormGroup;

  @Input() item: IItem;

  get firstName(): FormControl { return this.form.get('firstName') as FormControl; }
  get lastName(): FormControl { return this.form.get('lastName') as FormControl; }
  get address(): FormControl { return this.form.get('address') as FormControl; }
  get address2(): FormControl { return this.form.get('address2') as FormControl; }
  get city(): FormControl { return this.form.get('city') as FormControl; }
  get state(): FormControl { return this.form.get('state') as FormControl; }
  get postalCode(): FormControl { return this.form.get('postalCode') as FormControl; }
  get country(): FormControl { return this.form.get('country') as FormControl; }

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      id        : [{ value: '', disabled: true }, Validators.required],
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      address   : ['', Validators.required],
      address2  : ['', Validators.required],
      city      : ['', Validators.required],
      state     : ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5)]],
      country   : ['', Validators.required]
    });
  }

}
