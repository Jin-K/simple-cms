import { Injectable }                                           from '@angular/core';
import { Actions, Effect, ofType }                              from '@ngrx/effects';
import { Dictionary }                                           from '@ngrx/entity';
import { Store, select }                                        from '@ngrx/store';
import { of, iif }                                              from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  filter,
  mergeMap
}                                                               from 'rxjs/operators';

import { UserSelectors }                                        from '@core/auth';

import { entitySelectors, entityActions }                       from '..';
import { SelectionIdsStrategy, IEntityState, IEntitySelection } from '../reducers';
import { EntityService }                                        from '../../entity.service';

import * as _                                                   from 'lodash';

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
    private store: Store<IEntityState>
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
    map(([action, elementsState]: [entityActions.ChangeFilter | entityActions.Sort, Dictionary<IEntityState>]) => elementsState[action.entity]),
    // switch to observable of api request
    switchMap((entity: IEntityState) => this.entidadService.getItems(entity.name, entity.pagination, entity.filters).pipe(
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
   * The main deleteItemAndFetchAgain$ effect
   *
   * @description makes a delete request, if result == true ==> toggles item in selection if required,
   *              makes another this.entidadService.getItems get request and dispatch a new FetchItems action
   * @memberof EntityEffects
   */
  @Effect() deleteItemAndFetchAgain$ = this.actions$.pipe(
    // of type DELETE_ITEM
    ofType<entityActions.DeleteItem>(entityActions.DELETE_ITEM),
    // switchmap to api request observable
    switchMap(action => this.entidadService.deleteItem(action.entity, action.itemId).pipe(
      // take current entity state and selection from store
      withLatestFrom(this.store.pipe(select(entitySelectors.getCurrentEntity)), this.store.pipe(select(entitySelectors.getCurrentSelection))),
      // map to entity state but dispatch toggle action if deleted item was in ids set
      map(([, entity, selection]) => {
        // dispatch ToggleOne action if ids set is defined and contains the id
        if (selection.ids instanceof Set && selection.ids.has(action.itemId)) this.store.dispatch(new entityActions.ToggleOne(entity.name, action.itemId));
        // return only entity state
        return entity;
      }),
      // switchmap to new http observable to get items
      switchMap(entity => this.entidadService.getItems(entity.name, entity.pagination, entity.filters).pipe(
        // dispatch FetchItems action
        map( response => new entityActions.FetchItems( entity.name, response.body.value, JSON.parse( response.headers.get( 'X-Pagination' ) ).totalCount ) ),
        // catch eventual errors
        catchError(error => of(error))
      )),
      // catch eventual errors of delete requests and dispatch delete item failed action
      catchError(error =>  of(new entityActions.DeleteItemFailed(error))),
    ))
  );

  /**
   * The main deleteSelectedItemsAndFetchAgain$ effect
   *
   * @description very big effect ! if result == true ==> toggles range of items in selection.
   * It could perform a chain of requests to retrieve a normalized list of ids before delete, when
   * we have a state.elements.entities[].selection.strategy === SelectionIdsStrategy.Inversed
   * @memberof EntityEffects
   */
  @Effect() deleteSelectedItemsAndFetchAgain$ = this.actions$.pipe(
    // of type DELETE_SELECTED_ITEMS
    ofType<entityActions.DeleteSelectedItems>(entityActions.DELETE_SELECTED_ITEMS),
    // with current selection value from store
    withLatestFrom(this.store.pipe(select(entitySelectors.getCurrentSelection))),
    // switch map workaround to have 'action' and 'selection' available in lower levels ...
    switchMap( ([action, selection]) => of(this.getIdsFromSelection(selection) ).pipe(
      // if ids array contains negative values ==> get max 100 inversed ids for deletion (api is limited to 100 deletes max)
      mergeMap((ids) =>
        // iif rxjs operator to choose between 2 observables
        iif(
          // condition (any negative number ?)
          () =>  !!ids.find(id => id < 0),
          // get current filters from store then request api to get inversed ids and change ids in observable's response
          this.store.pipe(
            // get current filters
            select(entitySelectors.getCurrentFilters),
            // switch to http response of /entity/{inverse-ids}?entity=...
            switchMap( filters => this.entidadService.getInversedIdsForDeletion(action.entity, filters, ids) )
          ),
          // if condition above is false, return observable of input object
          of(ids)
      )),
      // switch map to api delete request observable
      switchMap(ids => this.entidadService.deleteItems(action.entity, ids).pipe(
        // take latest states for current entity and current selection
        withLatestFrom(this.store.pipe(select(entitySelectors.getCurrentEntity))),
        // map to current entity state
        map(([, entity]) => {
          // some items are selected
          if (selection.ids instanceof Set) {
            this.store.dispatch(new entityActions.ToggleRange(entity.name, ids));
          }
          // all items are selected
          else if (selection.ids === undefined && selection.strategy === SelectionIdsStrategy.Inversed) {
            this.store.dispatch(new entityActions.DeselectAll(entity.name));
          }
          // return only entity
          return entity;
        }),
        switchMap( entity => this.entidadService.getItems(entity.name, entity.pagination, entity.filters ).pipe(
          // dispatch FetchItems action
          map( response => new entityActions.FetchItems( entity.name, response.body.value, JSON.parse( response.headers.get( 'X-Pagination' ) ).totalCount ) ),
          // catch eventual errors
          catchError(error => of(new entityActions.FetchItemsFailed(action.entity, error)))
        ))
      )),
      // catch eventual errors of delete requests chain and dispatch delete selected items failed action
      catchError( error => of(new entityActions.DeleteSelectedItemsFailed(error)) )
    ))
  );

  /**
   * The main toggleFavoriteToApi$ effect
   *
   * @description make a put/delete request to api to add/remove favorite, redispatches
   *              ToggleFavoriteDone if ok, ToggleFavoriteFailed if api request failed
   * @memberof EntityEffects
   */
  @Effect() toggleFavoriteToApi$ = this.actions$.pipe(
    // of type TOGGLE_FAVORITE
    ofType<entityActions.ToggleFavorite>(entityActions.TOGGLE_FAVORITE),
    // take userId from auth store
    withLatestFrom(this.store.select(UserSelectors.getUserId)),
    // send to api and observe response
    switchMap(([action, userId]) => this.entidadService.toggleFavorite(action.add, userId, action.entity, action.itemId).pipe(
      // if success response ==> done action dispatched
      map(() => new entityActions.ToggleFavoriteDone(action.entity)),
      // if failed ==> dispatch failed action
      catchError(error => of(new entityActions.ToggleFavoriteFailed(action.entity, error)))
    ))
  );


  /**
   * The main toggleFavoriteDone$ effect
   *
   * @description on toggle favorite done, gets items from api and dispatches FetchItems action,
   *              or FetchItemsFailed if an error occurs
   * @memberof EntityEffects
   */
  @Effect() toggleFavoriteDone$ = this.actions$.pipe(
    // of type TOGGLE_FAVORITE_DONE
    ofType<entityActions.ToggleFavoriteDone>(entityActions.TOGGLE_FAVORITE_DONE),
    // with some store values
    withLatestFrom(this.store.select(entitySelectors.getCurrentPagination), this.store.select(entitySelectors.getCurrentFilters)),
    // switch to get items request observable
    switchMap(([action, pagination, filters]) => this.entidadService.getItems(action.entity, pagination, filters).pipe(
      // if success response ==> fetch items
      map( response => new entityActions.FetchItems( action.entity, response.body.value, JSON.parse ( response.headers.get( 'X-Pagination' ) ).totalCount ) ),
      // catch eventual errors
      catchError(error => of(new entityActions.FetchItemsFailed(action.entity, error)))
    ))
  );

  /**
   * Just transforms selection.strategy + selection.ids to array of ids,
   * but the type of numbers contained in the array are saying if we need to do an inverse delete
   *
   * @private
   * @param {IEntitySelection} selection entity selection from store
   * @returns {number[]} transformed array of ids
   * @memberof EntityEffects
   */
  private getIdsFromSelection(selection: IEntitySelection): number[] {

    // if some items selected (normal strategy) ==> ids set as array of ids
    if (selection.strategy === SelectionIdsStrategy.Normal && selection.ids instanceof Set)         return Array.from(selection.ids);
    // if some items selected (inversed strategy) ==> ids set as array of ids (but if ids have negative values: [-3, -7] ==> everything (max 100) except 3 and 7)
    else if (selection.strategy === SelectionIdsStrategy.Inversed && selection.ids instanceof Set)  return _.map(Array.from(selection.ids, id => -id));
    // if all selected ==> array with only 0 value ==> everything should be selected
    else if (selection.strategy === SelectionIdsStrategy.Inversed && selection.ids === undefined)   return [0];
    // if none selected ==> empty array
    else                                                                                            return [];

  }

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
