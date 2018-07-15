import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable }         from 'rxjs';
import * as actions           from './entity.actions';
import * as fromEntity        from './entity.reducer';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  entities: Observable<any>;

  constructor(
    private store: Store<fromEntity.EntitiesState>
  ) { }

  ngOnInit() {
    this.entities = this.store.select( fromEntity.selectAll );
  }

  createEntity() {
    const entity: fromEntity.Entity = {
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
