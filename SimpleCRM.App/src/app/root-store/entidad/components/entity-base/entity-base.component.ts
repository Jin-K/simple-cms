import { OnInit }             from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { Observable }         from 'rxjs';
import { IItem }              from '../../../../core/models';

const ENTITIES_ITEM_MAP: Map<string, string> = new Map([
  ['Contacts', 'contact'],
  ['Companies', 'company'],
  ['Actions', 'action']
]);

export abstract class EntityBaseComponent implements OnInit {
  public item$: Observable<IItem>;
  public entity: string;

  protected abstract route: ActivatedRoute;

  ngOnInit() {
    this.item$ = this.route.data.map(({ item }) => item);
    this.route.params.subscribe(params => this.entity = ENTITIES_ITEM_MAP.get(params.entity));
  }
}
