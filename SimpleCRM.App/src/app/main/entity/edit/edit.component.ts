import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { EntityBase } from '../entity-base.class';


/**
 * Entity-type item's edit component
 *
 * @export
 * @class EntityEditComponent
 * @extends {EntityBase}
 */
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EntityEditComponent extends EntityBase {


  /**
   * Creates an instance of EntityEditComponent.
   * @param {ActivatedRoute} route is injected here to be usable in base class
   * @memberof EntityEditComponent
   */
  constructor(protected route: ActivatedRoute) {
    super();
  }

}
