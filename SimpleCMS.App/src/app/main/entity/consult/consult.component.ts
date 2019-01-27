import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { EntityBase } from '../entity-base.class';

/**
 * Entity-type item's show component
 *
 * @export
 * @class EntityConsultComponent
 * @extends {EntityBase}
 */
@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class EntityConsultComponent extends EntityBase {

  /**
   * Creates an instance of EntityConsultComponent.
   *
   * @param {ActivatedRoute} route is injected here to be usable in base class
   * @memberof EntityConsultComponent
   */
  constructor(protected route: ActivatedRoute) {
    super();
  }

}
