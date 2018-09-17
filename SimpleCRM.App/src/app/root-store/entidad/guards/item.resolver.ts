import { Injectable }                                          from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable }                                           from 'rxjs';
import { catchError }                                           from 'rxjs/operators';

import { EntidadService }                                       from '../../../services/entidad.service';
import { IItem }                                                from '../../../models/interfaces';

/**
 * Copied over from Angular Router
 * @see https://goo.gl/8qUsNa
 */
const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';

/**
 * @description Retrieves item directly from API, no action/effect
 *              Cancelling when item does not exist, using a method described in this issue's response
 *              https://github.com/angular/angular/issues/22799#issuecomment-396023787
 * */
@Injectable()
export class ItemResolver implements Resolve<IItem> {
  constructor(
    private entidadService: EntidadService
  ) { }

  resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<IItem> {
    const entity: string = route.params.entity;
    const itemId: string = route.params.id;

    return this.entidadService.getItem(entity, itemId).pipe(
      catchError(() => {
        const errorMessage = 'error, item not found';
        alert(errorMessage);
        throw this.makeCancelingError(errorMessage);
      })
    );
  }

  /**
   * Similar to navigationCancelingError
   * @see https://goo.gl/nNd9TX
   */
  private makeCancelingError(message: string) {
    const error = Error('NavigationCancelingError: ' + message);
    (error as any)[NAVIGATION_CANCELING_ERROR] = true;
    return error;
  }
}
