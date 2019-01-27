import { Component, OnInit, Input } from '@angular/core';
import { IItem } from 'app/models';

@Component({
  selector: 'app-consult-details',
  templateUrl: './consult-details.component.html',
  styleUrls: ['./consult-details.component.scss']
})
export class ConsultDetailsComponent implements OnInit {

  @Input() item: IItem;

  constructor() { }

  ngOnInit() {
  }

}
