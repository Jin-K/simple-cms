import { Component, OnInit }                  from '@angular/core';
import { FormGroup, FormBuilder, FormArray }  from '@angular/forms';

@Component({
  selector: 'app-array-form',
  templateUrl: './array-form.component.html',
  styleUrls: ['./array-form.component.scss']
})
export class ArrayFormComponent implements OnInit {

  myForm: FormGroup;

  get phoneForms(): FormArray {
    return this.myForm.get('phones') as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: '',
      phones: this.fb.array([])
    });
  }

  addPhone(): void {
    const phone = this.fb.group({
      area: [],
      prefix: [],
      line: []
    });

    this.phoneForms.push(phone);
  }

  deletePhone(i: number): void {
    this.phoneForms.removeAt(i);
  }

}
