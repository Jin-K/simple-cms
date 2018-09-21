import { Component }            from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { EntityBaseComponent }  from './../entity-base/entity-base.component';

@Component({
  selector: 'app-entity-consult',
  templateUrl: './entity-consult.component.html',
  styleUrls: ['./entity-consult.component.scss']
})
export class EntityConsultComponent extends EntityBaseComponent {

  constructor(protected route: ActivatedRoute) {
    super();
  }

}
