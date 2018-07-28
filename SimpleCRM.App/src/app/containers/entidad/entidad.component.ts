import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable }         from 'rxjs';
import * as actions           from '../../root-store/entidad/actions';
import { EntidadesState }     from '../../root-store/entidad/state';
import * as entidadSelectors  from '../../root-store/entidad/selectors';
import { Entidad }            from '../../models/entidad';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  entities: Observable<any>;

  constructor(
    private store: Store<EntidadesState>
  ) { }

  ngOnInit() {
    debugger;
    this.entities = this.store.select( entidadSelectors.selectAll );
  }

  createEntidad() {
    const entity: Entidad = {
      id: new Date().getUTCMilliseconds().toString(),
      name: 'small',
    };

    this.store.dispatch( new actions.Create( entity ) );
  }

  updateEntidad(id: string, name: string) {
    this.store.dispatch( new actions.Update( id, { name } ) );
  }

  deleteEntidad(id: string) {
    this.store.dispatch( new actions.Delete( id ) );
  }
}
