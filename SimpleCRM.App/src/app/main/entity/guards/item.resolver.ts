import { Injectable }                                           from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot}  from '@angular/router';
import { Observable }                                           from 'rxjs';
import { catchError }                                           from 'rxjs/operators';
import { EntityService }                                        from '../entity.service';
import { IItem }                                                from 'app/models';

/**
 * Copied over from Angular Router
 *
 * @constant
 * @see https://goo.gl/8qUsNa
 */
const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';

/**
 * Retrieves item directly from API, no action/effect **cancelling** when item does not exist,
 * using a method described in this [issue response](https://github.com/angular/angular/issues/22799#issuecomment-396023787)
 *
 * @description resolves items from API
 * @export
 * @class ItemResolver
 * @implements {Resolve<IItem>}
 */
@Injectable()
export class ItemResolver implements Resolve<IItem> {


  /**
   * Creates an instance of ItemResolver.
   *
   * @param {EntityService} entityService
   * @memberof ItemResolver
   */
  constructor(
    private entityService: EntityService
  ) { }


  /**
   * Resolve method implementation, get item from EntityService
   *
   * @param {ActivatedRouteSnapshot} route activated route snapshot
   * @param {RouterStateSnapshot} _ unused
   * @returns {Observable<IItem>} observable item
   * @memberof ItemResolver
   */
  resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<IItem> {
    const entity: string = route.params.entity;
    const itemId: string = route.params.id;

    return this.entityService.getItem(entity, itemId).pipe(
      catchError(() => {
        const errorMessage = 'error, item not found';
        alert(errorMessage);
        throw this.makeCancelingError(errorMessage);
      })
    );
  }

  /**
   * Similar to navigationCancelingError
   *
   * @private
   * @param {string} message cancel message
   * @returns {Error} custom error with `NAVIGATION_CANCELING_ERROR` token
   * @memberof ItemResolver
   * @see https://goo.gl/nNd9TX
   */
  private makeCancelingError(message: string): Error {
    const error = Error('NavigationCancelingError: ' + message);
    (error as any)[NAVIGATION_CANCELING_ERROR] = true;
    return error;
  }

}
