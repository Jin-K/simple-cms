import { Injectable }               from '@angular/core';
import { Actions, Effect, ofType }  from '@ngrx/effects';
import { of as observableOf }       from 'rxjs';
import {
  switchMap,
  map,
  catchError
}                                   from 'rxjs/operators';

import { EntityService }            from '../../entity.service';
import * as entityActions           from '../actions';
import { IEntidad, IItem }          from '../../../../models';

@Injectable()
export class EntityEffects {
  constructor(
    private entidadService: EntityService,
    private actions$: Actions
  ) { }

  @Effect() getAllEntidades$ = this.actions$.pipe(
    ofType(entityActions.LOAD_ALL),
    switchMap(
      () => this.entidadService.getAllEntities().pipe(
        map((data: IEntidad[]) => new entityActions.LoadAllComplete(data)),
        catchError((error: any) => observableOf(error))
      )
    )
  );

  @Effect() pagination$ = this.actions$.pipe(
    ofType(entityActions.PAGINATE),
    switchMap((action: entityActions.Paginate) => this.entidadService.getAll(action.entity).pipe(
      map((response: any) => {
        const totalCount: number = JSON.parse(response.headers.get('X-Pagination')).totalCount;
        const dataSource: IItem[] = response.body.value;
        return new entityActions.PaginateSuccess(action.entity.charAt(0).toUpperCase() + action.entity.substring(1), dataSource, totalCount);
      }),
      catchError(error => observableOf(error))
    ))
  );
}
