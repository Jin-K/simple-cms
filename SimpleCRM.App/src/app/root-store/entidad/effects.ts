import { Injectable }         from '@angular/core';
import { Actions, Effect }    from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import {
  switchMap,
  map,
  catchError
}                             from 'rxjs/operators';

import { entidadActions }     from '.';
import { EntidadService }     from '../../core/services';
import {
  IEntidad,
  IItem
}                             from '../../core/models';

@Injectable()
export class EntidadEffects {
  constructor(
    private entidadService: EntidadService,
    private actions$: Actions
  ) { }

  @Effect() getAllEntidades$ = this.actions$.ofType(entidadActions.LOAD_ALL).pipe(
    switchMap(
      () => this.entidadService.getAllEntities().pipe(
        map((data: IEntidad[]) => new entidadActions.LoadAllComplete(data)),
        catchError((error: any) => observableOf(error))
      )
    )
  );

  @Effect() pagination$ = this.actions$.ofType(entidadActions.PAGINATE).pipe(
    switchMap((action: entidadActions.Paginate) => this.entidadService.getAll(action.entity).pipe(
      map((response: any) => {
        const totalCount: number = JSON.parse(response.headers.get('X-Pagination')).totalCount;
        const dataSource: IItem[] = response.body.value;
        return new entidadActions.PaginateSuccess(action.entity, dataSource, totalCount);
      }),
      catchError(error => observableOf(error))
    ))
  );
}
