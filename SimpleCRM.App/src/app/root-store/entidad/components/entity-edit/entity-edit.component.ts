import { Component }            from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { EntityBaseComponent }  from './../entity-base/entity-base.component';

@Component({
  selector: 'app-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent extends EntityBaseComponent {
  constructor(protected route: ActivatedRoute) {
    super();
  }
}
