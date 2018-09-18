import { Component, OnInit, Input } from '@angular/core';
import { IItem }                    from '../../../../core/models';

@Component({
  selector: 'app-entity-consult-detail',
  templateUrl: './entity-consult-detail.component.html',
  styleUrls: ['./entity-consult-detail.component.scss']
})
export class EntityConsultDetailComponent implements OnInit {

  @Input() item: IItem;

  constructor() { }

  ngOnInit() {
  }

}
