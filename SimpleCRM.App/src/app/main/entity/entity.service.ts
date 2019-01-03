import { HttpHeaders, HttpClient, HttpResponse }  from '@angular/common/http';
import { Injectable }                             from '@angular/core';
import { ActivatedRouteSnapshot, Resolve }        from '@angular/router';
import { Store, select }                          from '@ngrx/store';
import {
  Observable,
  BehaviorSubject,
  Subject,
  Subscription,
  of,
}                                                 from 'rxjs';
import { switchMap, take, catchError }            from 'rxjs/operators';

import { IItem }                                  from 'app/models';
import { coreConfig }                             from 'app/config';
import {
  ElementsState,
  entityActions,
  entitySelectors,
  EntityFilters
}                                                 from './store';
import { Item }                                   from './list/item.model';

/**
 * TODELETE constant string for 'application/json' ..
 *
 * @constant
 */
const APPLICATION_JSON = 'application/json';

/**
 * The main EntityService injectable class.
 *
 * Using BehaviorSubject typed objects, check [this issue reponse](https://stackoverflow.com/a/43351340/7210166)
 * to understeand the difference(s) with Subject typed objects.
 *
 * @description Service for entities and their items.
 * @export
 * @class EntityService
 */
@Injectable()
export class EntityService implements Resolve<any> {

  // private
  private readonly actionUrl = `${coreConfig.apiServer}/api/entity`;
  private readonly headers: HttpHeaders = new HttpHeaders();
  private readonly onUserDataChanged: BehaviorSubject<any>;

  // public
  user: any;

  /**
   * Creates an instance of EntityService.
   *
   * @param {HttpClient} http angular's http client
   * @param {PaginationService<IItem>} paginationService custom pagination service
   * @memberof EntityService
   */
  constructor(
    private http: HttpClient,
    private store: Store<ElementsState>
  ) {

    // set headers to use json
    this.headers = this.headers.set('Content-Type', APPLICATION_JSON);

    /** TO DELETE BELOW */

    // Set the defaults
    this.onUserDataChanged = new BehaviorSubject([]);

    /** TO DELETE ABOVE */
  }

  /**
   * Gets json response containing a chunk of items depending on the pagination settings and filters received as parameters
   *
   * @param {string} entity entity name
   * @param {*} pagination pagination settings
   * @param {EntityFilters} filters entity filters for category, user
   * @returns {Observable<HttpResponse<{links: any[], value: IItem[]}>>} returns an observable of the http response
   * @memberof EntityService
   */
  getItems(entity: string, pagination: any, filters: EntityFilters): Observable<HttpResponse<{links: any[], value: IItem[]}>> {

    // prepare query url
    let requestUrl = `${this.actionUrl}/items?entity=${entity}`
      + `&page=${pagination.page + 1}&pageCount=${pagination.pageCount}`
      + `&orderBy=${pagination.orderBy}`;

    // filter on user if specified
    if (filters.user) {
      requestUrl += `&userId=${filters.user.id}`;
    }

    // filter on category if specified
    if (filters.category !== 'all') {
      requestUrl += `&category=${filters.category}`;
    }

    // return observable of part of entity items with links
    return this.http.get<{links: any[], value: IItem[]}>(requestUrl, { observe: 'response', headers: this.headers });

  }

  /**
   * Gets an unique item of a specific entity depending on given id.
   *
   * @param {string} entity entity name
   * @param {string} id unique id of that item in specific table
   * @returns {Observable<IItem>} returns an observable of the item
   * @memberof EntityService
   */
  getItem(entity: string, id: string): Observable<IItem> {

    // prepare query url
    const requestUrl = `${this.actionUrl}/item?entity=${entity}&id=${id}`;

    // return http observable of the entity item
    return this.http.get<IItem>(requestUrl, { headers: this.headers });

  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route activated route snapshot
   * @returns {Observable<any>} returns observable of any (void)
   * @memberof EntityService
   */
  resolve(route: ActivatedRouteSnapshot): Observable<void> {

    // get entity name from url params and reformat
    const entity = this.onlyFirstLetterCapitalized(route.params.entity);

    // return observable
    return this.store.pipe(
      // select ElementsState
      select(entitySelectors.getElementsState),
      // take only 1 emitted value
      take(1),
      // switch to new observable and check if entity is already loaded with displayed items
      switchMap((elementsState: ElementsState) => elementsState.entities[entity] && elementsState.entities[entity].displayedItems !== undefined ?
        // if contains items, dispatch change entity action
        of(this.store.dispatch(new entityActions.ChangeEntity(entity))) :
        // if doesn't contains items, request api
        this.getItems(entity, elementsState.entities[entity].pagination, elementsState.entities[entity].filters).map(
          // dispatch fetch items action
          response => this.store.dispatch(new entityActions.FetchItems(entity, response.body.value, JSON.parse(response.headers.get('X-Pagination')).totalCount))
        )
      ),
      // catch eventual errors
      catchError(error => of(error))
    );

  }

  /** TO DELETE BELOW */

  /**
   * Get user data
   *
   * @returns {Promise<any>}
   */
  getUserData(): Promise<any> {

    // return promise
    return new Promise((resolve, reject) => {

      // xhr get request to api/item... to get user
      this.http.get(`${this.actionUrl}/entity-items-user`)
        .subscribe((response: any) => {

          // save response
          this.user = response;

          // trigger the next event
          this.onUserDataChanged.next(this.user);

          // resolve
          resolve(this.user);
        }, reject);
    });

  }

  /**
   * Update item
   *
   * @param item
   * @returns {Promise<any>}
   */
  updateItem(item): Promise<any> {

    // return promise
    return new Promise((resolve, reject) => {

      // xhr post request to api/item... to update an item
      this.http.post(`${this.actionUrl}/entity-items/${item.id}`, { ...item })
        .subscribe(response => {

          // get items again (async)
          // this.getItems();

          // resolve
          resolve(response);
        });
    });
  }

  /**
   * Update user data
   *
   * @param userData
   * @returns {Promise<any>}
   */
  updateUserData(userData): Promise<any> {

    // return promise
    return new Promise((resolve, reject) => {

      // xhr post request to api/item... to update user data
      this.http.post(`${this.actionUrl}/entity-items/${this.user.id}`, { ...userData }).subscribe(response => {

          // get user data again (async)
          this.getUserData();

          // get items again (async)
          // this.getItems();

          // resolve
          resolve(response);
        });
    });

  }

  /**
   * Delete item
   *
   * @param item
   */
  deleteItem(item): void {

    // // find position of item in array of items
    // // const itemIndex = this.items2.indexOf(item);
    // const itemIndex = this.items.indexOf(item);

    // // remove it from array
    // // this.items2.splice(itemIndex, 1);
    // this.items.splice(itemIndex, 1);

    // // trigger the next event
    // // this.onItemsChanged2.next(this.items2);
    // this.onItemsChanged.next(this.items);

  }

  /**
   * Delete selected items
   */
  deleteSelectedItems(): void {

    // // foreach item in array of selected items
    // // for (const itemId of this.selectedItems2) {
    // for (const itemId of this.selectedItems) {

    //   // find item
    //   // const item = this.items2.find(_item => _item.id === itemId);
    //   const item = this.items.find(_item => _item.id === itemId);

    //   // get position in array of items
    //   // const itemIndex = this.items2.indexOf(item);
    //   const itemIndex = this.items.indexOf(item);

    //   // remove of array of items
    //   // this.items2.splice(itemIndex, 1);
    //   this.items.splice(itemIndex, 1);
    // }

    // // trigger the next event
    // // this.onItemsChanged2.next(this.items2);
    // this.onItemsChanged.next(this.items);

    // // deselect all items
    // this.deselectItems();

  }

  /** TO DELETE ABOVE */


  /**
   * Deselect all items for given entity
   *
   * @param {string} entity entity name
   * @memberof EntityService
   */
  deselectItems(entity: string): void {

    // dispatch deselect all action
    this.store.dispatch(new entityActions.DeselectAll(entity));

  }

  /**
   * The main loadEntityView method
   *
   * @description loads entity pagination and filter options for a specific user
   * @param {string} entity entity name
   * @returns {(Observable<{ entity: string, pagination?: any, filters?: any | undefined }>)} observable of object containing entity, pagination and filter options
   * @memberof EntityService
   */
  loadEntityView(entity: string): Observable<entityActions.LoadEntityCompletePayload> {

    // prepare query url
    const requestUrl = `${this.actionUrl}/list-view-settings?entityName=${entity}`;

    // return observable of the user's entity view settings
    return this.http.get<entityActions.LoadEntityCompletePayload>(requestUrl, { headers: this.headers });
  }

  /**
   * Util method to capitalize the first letter of a string and set the rest of the string to lower case.
   * TODO move it in a global utils file ?
   *
   * @private
   * @param {string} str string to adapt
   * @returns {string} adapted string
   * @memberof EntityService
   */
  private onlyFirstLetterCapitalized(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
  }

}
