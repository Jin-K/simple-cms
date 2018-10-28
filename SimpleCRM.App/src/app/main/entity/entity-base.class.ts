import { ActivatedRoute } from '@angular/router';
import { OnInit }         from '@angular/core';
import { Observable }     from 'rxjs';

import { IItem }          from 'app/models';

const ENTITIES_ITEM_MAP: Map<string, string> = new Map([
  ['contacts', 'contact'],
  ['companies', 'company'],
  ['actions', 'action']
]);

export abstract class EntityBase implements OnInit {
  public item$: Observable<IItem>;
  public entity: string;

  protected abstract route: ActivatedRoute;

  ngOnInit(): void {
    this.item$ = this.route.data.map(({item}) => item);
    this.route.params.subscribe(params => this.entity = ENTITIES_ITEM_MAP.get(params.entity));
  }
}