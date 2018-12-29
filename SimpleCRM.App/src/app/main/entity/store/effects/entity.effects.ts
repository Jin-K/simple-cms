import { Injectable }                                           from '@angular/core';
import { Actions, Effect, ofType }                              from '@ngrx/effects';
import { Dictionary }                                           from '@ngrx/entity';
import { Store, select }                                        from '@ngrx/store';
import { of }                                                   from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom
}                                                               from 'rxjs/operators';

import { entitySelectors, entityActions, ElementsEntityState }  from '..';
import { EntityService }                                        from '../../entity.service';
import { IItem }                                                from '../../../../models';

/**
 * The main EntityEffects class
 *
 * @export
 * @class EntityEffects
 */
@Injectable()
export class EntityEffects {

  /**
   * Constructor
   *
   * @param {EntityService} entidadService service for entities and entity items
   * @param {Actions} actions$ '@ngrx' actions observable
   * @memberof EntityEffects
   */
  constructor(
    private entidadService: EntityService,
    private actions$: Actions,
    private store: Store<ElementsEntityState>
  ) { }

  /**
   * Effect of paginating
   *
   * @memberof EntityEffects
   */
  @Effect() paginateSuccess$ = this.actions$.pipe(
    // of type PAGINATE
    ofType(entityActions.PAGINATE),
    // get items list from service
    switchMap((action: entityActions.Paginate) => this.entidadService.getItemsList(action.entity).pipe(
      // map http response to get totalCount, items and then dispatch a new action
      map((response: any) => {
        // get totalCount from 'X-Pagination' header
        const totalCount: number = JSON.parse(response.headers.get('X-Pagination')).totalCount;
        // get items from body
        const dataSource: IItem[] = response.body.value;
        // dispatch new PAGINATE_SUCCESS action
        return new entityActions.PaginateSuccess(this.onlyFirstLetterCapitalized(action.entity), dataSource, totalCount);
      }),
      // handle error(s)
      catchError(error => of(error))
    ))
  );

  /**
   * Effect of loading an entity.
   * Should occure only once per entity (on first listingEntity$ effect) and retrieves pagination/filter settings from api.
   *
   * @memberof EntityEffects
   */
  @Effect() loadEntityViewComplete$ = this.actions$.pipe(
    // of type LOAD_ENTITY
    ofType(entityActions.LOAD_ENTITY),
    // load entity options via entity service
    switchMap((action: entityActions.LoadEntity) => this.entidadService.loadEntityView(this.onlyFirstLetterCapitalized(action.entity)).pipe(
      // dispatch new LOAD_ENTITY_COMPLETE action
      map(options => new entityActions.LoadEntityComplete(action.entity, options)),
      // handle error(s)
      catchError(error => of(error))
    ))
  );

  /**
   * Effect of sorting, filtering or paginating
   *
   * @memberof EntityEffects
   */
  @Effect({dispatch: false}) refreshDisplayItems$ = this.actions$.pipe(
    // of type CHANGE_FILTER or type SORT
    ofType(entityActions.CHANGE_FILTER, entityActions.SORT),
    // take latest value of entities in ElementsState (state.elements.entities)
    withLatestFrom(this.store.pipe(select(entitySelectors.selectEntities))),
    // map to current entity instance (of type ElementsEntityState)
    map(([action, elementsState]: [entityActions.ChangeFilter | entityActions.Sort, Dictionary<ElementsEntityState>]) => elementsState[action.entity]),
    // switch to observable of api request
    switchMap((entity: ElementsEntityState) => this.entidadService.getItems2(entity.name, entity.pagination, entity.filters).pipe(
      // dispatch fetch items action on response
      tap(response => this.store.dispatch(new entityActions.FetchItems(entity.name, response.body.value))),
      // catch eventual errors
      catchError(error => of(error))
    ))
  );

  /**
   * Util method to capitalize the first letter of a string and set the rest of the string to lower case.
   * TODO move it in a global utils file ?
   *
   * @private
   * @param {string} str string to adapt
   * @returns {string} adapted string
   * @memberof EntityEffects
   */
  private onlyFirstLetterCapitalized(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  }

}
