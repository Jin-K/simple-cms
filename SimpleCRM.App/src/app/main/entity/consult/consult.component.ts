import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { EntityBase } from '../entity-base.class';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class EntityConsultComponent extends EntityBase {

  constructor(protected route: ActivatedRoute) {
    super();
  }

}
