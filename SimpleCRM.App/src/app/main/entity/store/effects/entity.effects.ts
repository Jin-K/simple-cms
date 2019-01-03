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
  withLatestFrom,
  filter
}                                                               from 'rxjs/operators';

import { entitySelectors, entityActions, ElementsEntityState }  from '..';
import { SelectionIdsStrategy }                                 from '../reducers';
import { EntityService }                                        from '../../entity.service';

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
   * The main loadEntityViewComplete$ effect
   *
   * @description effect of loading an entity.
   * Should occure only once per entity (on first listingEntity$ effect) and retrieves pagination/filter settings from api.
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
   * The main refreshDisplayItems$ effect
   *
   * @description effect of sorting, filtering or paginating
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
    switchMap((entity: ElementsEntityState) => this.entidadService.getItems(entity.name, entity.pagination, entity.filters).pipe(
      // dispatch fetch items action on response
      tap( response => this.store.dispatch( new entityActions.FetchItems( entity.name, response.body.value, JSON.parse( response.headers.get( 'X-Pagination' ) ).totalCount ) ) ),
      // catch eventual errors
      catchError(error => of(error))
    ))
  );

  /**
   * The main clearSelectionOnChangeFilters$ effect
   *
   * @description when changing filter(s) (user, category), we must clear selection because total items length will not be the same
   * @memberof EntityEffects
   */
  @Effect() clearSelectionOnChangeFilter$ = this.actions$.pipe(
    // of type CHANGE_FILTER
    ofType<entityActions.ChangeFilter>(entityActions.CHANGE_FILTER),
    // with latest value of selection
    withLatestFrom(this.store.pipe(select(entitySelectors.getCurrentSelection))),
    // don't need to deselect all if no selection at all
    filter(([, selection]) => !( selection.strategy === SelectionIdsStrategy.Normal && selection.ids === undefined )),
    // just dispatch a deselect all action
    map(([{entity}]) => new entityActions.DeselectAll(entity)),
    // catch eventual errors
    catchError(error => of(error))
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
