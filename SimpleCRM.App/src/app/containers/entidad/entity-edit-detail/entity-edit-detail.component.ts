import { Component, OnInit, Input } from '@angular/core';
import { IItem }                    from '../../../models/interfaces';

@Component({
  selector: 'app-entity-edit-detail',
  templateUrl: './entity-edit-detail.component.html',
  styleUrls: ['./entity-edit-detail.component.scss']
})
export class EntityEditDetailComponent implements OnInit {

  @Input() item: IItem;

  constructor() { }

  ngOnInit(): void {
  }

}
