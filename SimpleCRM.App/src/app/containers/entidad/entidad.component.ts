import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Store }                        from '@ngrx/store';
import { Observable, Subscription }     from 'rxjs';

import * as actions                     from '../../root-store/entidad/actions';
import { ItemsState }                   from '../../root-store/entidad/state';
import { IItem }                        from '../../models/interfaces';
import { Contact }                      from '../../models/contact';
import { Action }                       from '../../models/action';
import { Company }                      from '../../models/company';

import * as _                           from 'lodash';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit, OnDestroy {

  entities: Observable<ItemsState[]>;
  items: Observable<IItem[]>;

  entity: string;
  sub: Subscription;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const entity = params['entity'];
      this.entity = entity;
      // TODO: dispatch action to load the details here.
      this.items = this.store.select(state => _.toArray(state.entidad.entities[entity] ? state.entidad.entities[entity].entities : [] ));
    });
    // this.entities = this.store.select( entidadSelectors.selectAll );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createEntidad() {
    let newItem: IItem;
    switch (this.entity) {
      case 'Contacts': newItem = new Contact('Muñoz', 'Pablo'); break;
      case 'Companies': newItem = new Company('Jin-K empire'); break;
      case 'Actions': newItem = new Action('Work !'); break;
    }

    this.store.dispatch(new actions.Create(newItem, this.entity ) );
  }

  updateEntidad(id: number) {
    this.store.dispatch( new actions.Update( id, this.entity, { dCreate: new Date() } ) );
  }

  deleteEntidad(id: number) {
    this.store.dispatch( new actions.Delete( id, this.entity ) );
  }
}
