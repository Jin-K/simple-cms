import { ActivatedRoute } from '@angular/router';
import { OnInit }         from '@angular/core';
import { Observable }     from 'rxjs';

import { IItem }          from 'app/models';

/**
 * Map of valid entity-item names
 *
 * @constant
 * @type {Map<string, string>}
 */
const ENTITIES_ITEM_MAP: Map<string, string> = new Map([
  ['contacts', 'contact'],
  ['companies', 'company'],
  ['actions', 'action']
]);

/**
 * Entity base class.
 * Extended by EntityEditComponent and EntityConsultComponent
 *
 * @export
 * @abstract
 * @class EntityBase
 * @implements {OnInit}
 */
export abstract class EntityBase implements OnInit {

  /**
   * Observable of the item to edit / show
   *
   * @type {Observable<IItem>}
   * @memberof EntityBase
   */
  public item$: Observable<IItem>;


  /**
   * Entity label (Cont, Comp, ...)
   *
   * @type {string}
   * @memberof EntityBase
   */
  public entity: string;


  /**
   * Activated route, has to be injected in child constructor
   *
   * @protected
   * @abstract
   * @type {ActivatedRoute}
   * @memberof EntityBase
   */
  protected abstract route: ActivatedRoute;


  /**
   * Initializes ```this.items$```(observable) with the ```{item}```(property) of the
   * route's resolved data (```this.route.data```)
   *
   * and subscribes to route's parameters to validate and set the entity name in ```super.entity```
   * which is public to be accessible from child's html templates
   *
   * @description if OnInit is implemented on child component, we have to make a super call to this method
   * @memberof EntityBase
   */
  ngOnInit(): void {
    this.item$ = this.route.data.map(({item}) => item);
    this.route.params.subscribe(params => this.entity = ENTITIES_ITEM_MAP.get(params.entity));
  }

}
