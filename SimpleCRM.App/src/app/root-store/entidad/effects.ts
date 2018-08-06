import { Injectable }                 from '@angular/core';
import { Actions, Effect }            from '@ngrx/effects';
import { of }                         from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as entidadesActions          from './actions';
import { EntidadService }             from '../../services/entidad.service';
import { IEntidad }                   from '../../models/interfaces';

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
}
