import { HttpHeaders, HttpClient, HttpResponse }                from '@angular/common/http';
import { Injectable }                                           from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Store, select }                                        from '@ngrx/store';
import {
  Observable,
  BehaviorSubject,
  Subject,
  Subscription,
  of,
}                                                               from 'rxjs';
import { switchMap, take, catchError }                          from 'rxjs/operators';

import { PaginationService }                                    from '@core/pagination';

import { IItem }                                                from 'app/models';
import { coreConfig }                                           from 'app/config';
import { Item }                                                 from './list/item.model';
import { ElementsState, entityActions, entitySelectors }        from './store';

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
 * to understeand the difference(s) with regular Subject typed objects.
 *
 * Probably used to be able to subscribe to it and get values from, even if we called .next() on it before.
 * So if onItemsChanged is triggered before EntityItemsListDetailsComponent's ngOnInit() method and FilesDataSource initialization,
 * the datasource of EntityItemsListDetailsComponent will receive data on later subscription
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
  private readonly entityFilterSubscriptions: {[key: string]: Subscription} = {};

  // public
  items: IItem[];
  onItemsChanged = new BehaviorSubject<IItem[]>([]);
  selectedItems: number[] = [];
  onSelectedItemsChanged = new BehaviorSubject<any>([]);
  readonly onFilterChanged: {[key: string]: Subject<any>} = {};

  /** TO DELETE BELOW */

  items2: Item[];
  user: any;
  selectedItems2: string[] = [];
  searchText: string;
  filterBy: string;

  onItemsChanged2: BehaviorSubject<any>;
  onFilterChanged2: Subject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSelectedItemsChanged2: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;

  /** TO DELETE ABOVE */

  /**
   * Creates an instance of EntityService.
   *
   * @param {HttpClient} http angular's http client
   * @param {PaginationService<IItem>} paginationService custom pagination service
   * @memberof EntityService
   */
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService<IItem>,
    private store: Store<ElementsState>
  ) {

    // set headers to use json
    this.headers = this.headers.set('Content-Type', APPLICATION_JSON);

    /** TO DELETE BELOW */

    // Set the defaults
    this.onItemsChanged2 = new BehaviorSubject([]);
    this.onSelectedItemsChanged2 = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged2 = new Subject();

    /** TO DELETE ABOVE */
  }

  getItems2(entity: string, pagination: any, filters: entityActions.EntityListFilters): Observable<HttpResponse<{links: any[], value: IItem[]}>> {

    // prepare query url
    let requestUrl = `${this.actionUrl}/items?page=${pagination.page + 1}`
      + `&pageCount=${pagination.pageCount}`
      + `&orderBy=${pagination.orderBy}&query=${entity}`;

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
   * Gets part of list / chunk of entity items depending on pagination settings.
   *
   * @param {string} entity entity name
   * @returns {Observable<HttpResponse<IItem[]>>} returns an observable of the array of entity items
   * @memberof EntityService
   */
  getItemsList(entity: string): Observable<HttpResponse<{links: any[], value: IItem[]}>> {

    // get pagination settings from pagination service
    const paginationSettings = this.paginationService.getPaginationSettings(entity);

    // set pagination as loading
    paginationSettings.loading = true;

    // prepare query url
    const requestUrl = `${this.actionUrl}/items?page=${paginationSettings.page}`
      + `&pageCount=${paginationSettings.pageSize}`
      + `&orderBy=${paginationSettings.sort}&query=${entity}`;

    // return http observable of part of entity items
    return this.http.get<{links: any[], value: IItem[]}>(requestUrl, { observe: 'response', headers: this.headers })

      // do this with response also
      .do(response => {

        // filter if specified
        switch (this.filterBy) {
          case 'starred':
            this.items = response.body.value.filter( _item => this.user.starred.includes(_item.id) );
            break;
          case 'frequent':
            this.items = response.body.value.filter( _item => this.user.frequentItems.includes(_item.id) );
            break;
          default:
            this.items = response.body.value;
            break;
        }

        // trigger onItemsChanged event
        this.onItemsChanged.next(this.items);
      });

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
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

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
        this.getItems2(entity, elementsState.entities[entity].pagination, elementsState.entities[entity].filters).map(
          // dispatch fetch items action
          response => this.store.dispatch(new entityActions.FetchItems(entity, response.body.value))
        )
      ),
      // catch eventual errors
      catchError(error => of(error))
    );

  }

  /** TO DELETE BELOW */

  // /**
  //  * Resolver
  //  *
  //  * @param {ActivatedRouteSnapshot} route activated route snapshot
  //  * @param {RouterStateSnapshot} state router state snapshot
  //  * @returns {Observable<HttpResponse<{links: any[], value: IItem[]}>>} returns observable of http response
  //  * @memberof EntityService
  //  */
  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HttpResponse<{links: any[], value: IItem[]}>> {

  //   // get entity name from url params
  //   const entity = this.onlyFirstLetterCapitalized(route.params.entity);

  //   // create observable of final result of 2 requests
  //   let observableOfCompletedRequests = forkJoin(
  //     this.getItemsList(entity),
  //     from(this.getUserData())
  //   );

  //   // if no subscription for that entity filters exists
  //   if (!this.entityFilterSubscriptions[entity]) {

  //     // do this also on resolve
  //     observableOfCompletedRequests = observableOfCompletedRequests.do(_ => {

  //       // create new subject for filter
  //       const subject = new Subject<string>();

  //       // attach subject to subjects registry object
  //       this.onFilterChanged[entity] = subject;

  //       // subscribe to that subject for filter changes (it will be triggered elsewhere)
  //       const subscription = subject.subscribe(filter => {

  //         // save filter
  //         this.filterBy = filter;

  //         // reload list of items
  //         this.getItemsList(entity).toPromise();
  //       });

  //       // attach usbscription to subscriptions registry object
  //       this.entityFilterSubscriptions[entity] = subscription;
  //     });
  //   }

  //   // return observable and catch errors if there are
  //   return observableOfCompletedRequests.catch(error => of(error));

  // }

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
   * Toggle selected item by id
   *
   * @param id
   */
  toggleSelectedItem(id): void {

    // first, check if we already have that item as selected...
    // if (this.selectedItems2.length > 0) {
    if (this.selectedItems.length > 0) {

      // get position in selected items array
      // const index = this.selectedItems2.indexOf(id);
      const index = this.selectedItems.indexOf(id);

      if (index !== -1) {

        // remove from array
        // this.selectedItems2.splice(index, 1);
        this.selectedItems.splice(index, 1);

        // trigger the next event
        // this.onSelectedItemsChanged.next(this.selectedItems2);
        this.onSelectedItemsChanged.next(this.selectedItems);

        // return
        return;
      }
    }

    // if we don't have it, push as selected
    // this.selectedItems2.push(id);
    this.selectedItems.push(id);

    // trigger the next event
    // this.onSelectedItemsChanged.next(this.selectedItems2);
    this.onSelectedItemsChanged.next(this.selectedItems);

  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {

    // if items are selected
    // if (this.selectedItems2.length > 0) {
    if (this.selectedItems.length > 0) {

      // deselect all
      this.deselectItems();
    }
    else {

      // select all
      this.selectItems();
    }

  }

  /**
   * Select items
   *
   * @param filterParameter
   * @param filterValue
   */
  selectItems(filterParameter?, filterValue?): void {

    // clear selected items array
    // this.selectedItems2 = [];
    this.selectedItems = [];

    // if there is no filter, select all items
    if (filterParameter === undefined || filterValue === undefined) {

      // clear selected items array
      // this.selectedItems2 = [];
      this.selectedItems = [];

      // push id of all items to selected items array
      // this.items2.map(item => {
      this.items.map(item => {
        // this.selectedItems2.push(item.id);
        this.selectedItems.push(item.id);
      });
    }

    // trigger the next event
    // this.onSelectedItemsChanged.next(this.selectedItems2);
    this.onSelectedItemsChanged.next(this.selectedItems);

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
   * Deselect items
   */
  deselectItems(): void {

    // clear selected items array
    // this.selectedItems2 = [];
    this.selectedItems = [];

    // Trigger the next event
    // this.onSelectedItemsChanged.next(this.selectedItems2);
    this.onSelectedItemsChanged.next(this.selectedItems);

  }

  /**
   * Delete item
   *
   * @param item
   */
  deleteItem(item): void {

    // find position of item in array of items
    // const itemIndex = this.items2.indexOf(item);
    const itemIndex = this.items.indexOf(item);

    // remove it from array
    // this.items2.splice(itemIndex, 1);
    this.items.splice(itemIndex, 1);

    // trigger the next event
    // this.onItemsChanged2.next(this.items2);
    this.onItemsChanged.next(this.items);

  }

  /**
   * Delete selected items
   */
  deleteSelectedItems(): void {

    // foreach item in array of selected items
    // for (const itemId of this.selectedItems2) {
    for (const itemId of this.selectedItems) {

      // find item
      // const item = this.items2.find(_item => _item.id === itemId);
      const item = this.items.find(_item => _item.id === itemId);

      // get position in array of items
      // const itemIndex = this.items2.indexOf(item);
      const itemIndex = this.items.indexOf(item);

      // remove of array of items
      // this.items2.splice(itemIndex, 1);
      this.items.splice(itemIndex, 1);
    }

    // trigger the next event
    // this.onItemsChanged2.next(this.items2);
    this.onItemsChanged.next(this.items);

    // deselect all items
    this.deselectItems();

  }

  /** TO DELETE ABOVE */

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
   * Clean entity filter subscriptions
   *
   * @memberof EntityService
   */
  cleanFilterSubscriptions(): void {

    // unsubscribe from all entity filter supscriptions
    for (const prop in this.entityFilterSubscriptions) {

      // ensure prop
      if (this.entityFilterSubscriptions.hasOwnProperty(prop)) {

        // unsubscribe
        this.entityFilterSubscriptions[prop].unsubscribe();

        // remove key from dictionary
        delete this.entityFilterSubscriptions[prop];
      }
    }

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
