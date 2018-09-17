import { Injectable }         from '@angular/core';
import { Actions, Effect }    from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import {
  switchMap,
  map,
  catchError
}                             from 'rxjs/operators';

import * as entidadesActions  from './actions';
import { EntidadService }     from '../../services/entidad.service';
import {
  IEntidad,
  IItem
}                             from '../../models/interfaces';

@Injectable()
export class EntidadEffects {
  constructor(
    private entidadService: EntidadService,
    private actions$: Actions
  ) { }

  @Effect() getAllEntidades$ = this.actions$.ofType(entidadesActions.LOAD_ALL).pipe(
    switchMap(
      () => this.entidadService.getAllEntities().pipe(
        map((data: IEntidad[]) => new entidadesActions.LoadAllComplete(data)),
        catchError((error: any) => observableOf(error))
      )
    )
  );

  @Effect() pagination$ = this.actions$.ofType(entidadesActions.PAGINATE).pipe(
    switchMap((action: entidadesActions.Paginate) => this.entidadService.getAll(action.entity).pipe(
      map((response: any) => {
        const totalCount: number = JSON.parse(response.headers.get('X-Pagination')).totalCount;
        const dataSource: IItem[] = response.body.value;
        return new entidadesActions.PaginateSuccess(action.entity, dataSource, totalCount);
      }),
      catchError(error => observableOf(error))
    ))
  );
}
