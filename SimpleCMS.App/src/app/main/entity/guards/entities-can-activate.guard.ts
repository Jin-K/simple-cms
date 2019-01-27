import { Injectable }                                     from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot }            from '@angular/router';
import { Store }                                          from '@ngrx/store';
import { Observable, of as observableOf }                 from 'rxjs';

import { entitySelectors, entityActions, ElementsState }  from '../store';

/**
 * The main EntitiesActivableGuard class.
 *
 * @export
 * @class EntitiesActivableGuard
 * @implements {CanActivate}
 */
@Injectable()
export class EntitiesActivableGuard implements CanActivate {

  /**
   * Constructor
   *
   * @param {Store<ElementsState>} store ngrx store
   * @memberof EntitiesActivableGuard
   */
  constructor(private store: Store<ElementsState>) { }

  /**
   * Try to get entity data synchronously if it is not loaded yet
   *
   * @param {string} entityName name of entity
   * @returns {Observable<any>} observable of any, we just need an observable to subscribe on and intercept event in calling method
   * @memberof EntitiesActivableGuard
   */
  getFromStoreOrLoadFromAPI(entityName: string): Observable<any> {

    // return an Observable stream from the store
    return this.store
      // select entity ids and cast to string[]
      .select(entitySelectors.selectIds as (state: object) => string[])
      // for each event, do
      .do(ids => {
        // dispatch a load entity action if it isn't loaded yet
        if (!ids.includes(entityName)) this.store.dispatch(new entityActions.LoadEntity(entityName));
      })
      // on event, filter to check if it is loaded
      .filter(ids => ids.includes(entityName))
      // if loaded, take event as last one and return
      .take(1);

  }

  /**
   * Supposed to check if we can active the route,
   * but we are forcing (with getFromStoreOrAPI) the loading of entity and we only return true when it is done
   *
   * @param {ActivatedRouteSnapshot} routeSnapshot activated route snapshot
   * @returns {Observable<boolean>} an observable of the response ==> true
   * @memberof EntitiesActivableGuard
   */
  canActivate(routeSnapshot: ActivatedRouteSnapshot): Observable<boolean> {

    // return our Observable stream from above
    return this.getFromStoreOrLoadFromAPI(this.onlyFirstLetterCapitalized(routeSnapshot.params.entity))
      // if it was successful, we can return Observable.of(true)
      .switchMap(() => observableOf(true))
      // otherwise, something went wrong
      .catch(() => observableOf(false));

  }

  /**
   * Util method to capitalize the first letter of a string and set the rest of the string to lower case.
   * TODO move it in a global utils file ?
   *
   * @private
   * @param {string} str string to adapt
   * @returns {string} adapted string
   * @memberof EntitiesActivableGuard
   */
  private onlyFirstLetterCapitalized(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  }

}
