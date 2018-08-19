import { Injectable }                 from '@angular/core';
import { Actions, Effect }            from '@ngrx/effects';
import { of }                         from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as entidadesActions          from './actions';
import { EntidadService }             from '../../services/entidad.service';
import { IEntidad, IItem }            from '../../models/interfaces';

@Injectable()
export class EntidadEffects {
  constructor(
    private entidadService: EntidadService,
    private actions$: Actions
  ) { }

  @Effect() getAllEntidades$ = this.actions$.ofType(entidadesActions.LOAD_ALL).pipe(
    switchMap(
      () => this.entidadService.getAllEntidades().pipe(
        map((data: IEntidad[]) => new entidadesActions.LoadAllComplete(data)),
        catchError((error: any) => of(error))
      )
    )
  );

  @Effect() getAllItems$ = this.actions$.ofType(entidadesActions.LOAD_ALL_ITEMS).pipe(
    switchMap(
      (action: entidadesActions.LoadAllItems) => this.entidadService.getAllItems(action.entity).pipe(
        map((data: IItem[]) => new entidadesActions.LoadAllItemsComplete(action.entity, data)),
        catchError((error: any) => of (error))
      )
    )
  );
}
