import { Component, OnInit, Input } from '@angular/core';
import { IItem } from 'app/models';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit {

  @Input() item: IItem;

  constructor() { }

  ngOnInit() {
  }

}
