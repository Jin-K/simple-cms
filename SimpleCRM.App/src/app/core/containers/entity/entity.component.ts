import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable }         from 'rxjs';
import * as actions           from '../../../root-store/entity/actions';
import { EntitiesState }      from '../../../root-store/entity/state';
import * as entitySelectors   from '../../../root-store/entity/selectors';
import { Entity }             from '../../models/entity';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  entities: Observable<any>;

  constructor(
    private store: Store<EntitiesState>
  ) { }

  ngOnInit() {
    this.entities = this.store.select( entitySelectors.selectAll );
  }

  createEntity() {
    const entity: Entity = {
      id: new Date().getUTCMilliseconds().toString(),
      name: 'small',
    };

    this.store.dispatch( new actions.Create( entity ) );
  }

  updateEntity(id: string, name: string) {
    this.store.dispatch( new actions.Update( id, { name } ) );
  }

  deleteEntity(id: string) {
    this.store.dispatch( new actions.Delete( id ) );
  }
}
