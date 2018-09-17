import { Component, OnInit }   from '@angular/core';
import { EntityBaseComponent } from '../entity-base/entity-base.component';

@Component({
  selector: 'app-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent extends EntityBaseComponent implements OnInit {

  ngOnInit() { super.ngOnInit(); }

}
