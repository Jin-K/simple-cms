import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { EntityBase } from '../entity-base.class';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EntityEditComponent extends EntityBase {

  constructor(protected route: ActivatedRoute) {
    super();
  }

}
