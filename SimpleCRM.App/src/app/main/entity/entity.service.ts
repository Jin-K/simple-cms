import { HttpHeaders, HttpClient, HttpResponse }                from '@angular/common/http';
import { Injectable }                                           from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, BehaviorSubject, Subject }                 from 'rxjs';

import { PaginationService }                                    from '@core/pagination';
import { FuseUtils }                                            from '@fuse/utils';

import { IItem, IEntidad }                                      from 'app/models';
import { coreConfig }                                           from 'app/config';
import { Item }                                                 from './list/item.model';

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
 * to understeand the difference with regular Subject typed objects
 *
 * @description Service for entities and their items.
 * @export
 * @class EntityService
 */
@Injectable()
export class EntityService implements Resolve<any> {

  // private
  private actionUrl = `${coreConfig.apiServer}/api/entity`;
  private headers: HttpHeaders = new HttpHeaders();

  /** TO DELETE BELOW */

  items: Item[];
  user: any;
  selectedItems: string[] = [];
  searchText: string;
  filterBy: string;

  onItemsChanged: BehaviorSubject<any>;
  onFilterChanged: Subject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSelectedItemsChanged: BehaviorSubject<any>;
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
    private paginationService: PaginationService<IItem>
  ) {

    // set headers to use json
    this.headers = this.headers.set('Content-Type', APPLICATION_JSON);

    /** TO DELETE BELOW */

    // Set the defaults
    this.onItemsChanged = new BehaviorSubject([]);
    this.onSelectedItemsChanged = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();

    /** TO DELETE ABOVE */
  }

  /**
   * Gets all main entities.
   *
   * @description GET api/entities
   * @returns {Observable<IEntidad[]>} returns an observable of an array of main entities
   * @memberof EntityService
   */
  getAllEntities(): Observable<IEntidad[]> {

    // return http observable result
    return this.http.get<IEntidad[]>(`${this.actionUrl}/entities`, { headers: this.headers });
  }

  /**
   * Gets part of list / chunk of entity items depending on pagination settings.
   *
   * @param {string} entity entity name
   * @returns {Observable<HttpResponse<IItem[]>>} returns an observable of the array of entity items
   * @memberof EntityService
   */
  getItemsList(entity: string): Observable<HttpResponse<IItem[]>> {
    // get pagination settings from pagination service
    const paginationSettings = this.paginationService.getPaginationSettings(entity);

    // set pagination as loading
    paginationSettings.loading = true;

    // prepare query url
    const requestUrl = `${this.actionUrl}/items?page=${paginationSettings.page}`
      + `&pageCount=${paginationSettings.pageSize}`
      + `&orderBy=${paginationSettings.sort}&query=${entity}`;

    // return http observable of part of entity items
    return this.http.get<IItem[]>(requestUrl, { observe: 'response', headers: this.headers });
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

  /** TO DELETE BELOW */

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route activated route snapshot
   * @param {RouterStateSnapshot} state router state snapshot
   * @returns {(Observable<any> | Promise<any> | any)} returns observable of nothing
   * @memberof EntityService
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getItems(),
        this.getUserData()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getItems();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getItems();
          });

          resolve();
        },
        reject
      );
    });
  }

  getItems(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.get( `${this.actionUrl}/entity-items` )
        .subscribe((response: any) => {

          this.items = response;

          if (this.filterBy === 'starred') {

            this.items = this.items.filter(
              _item => this.user.starred.includes(_item.id)
            );
          }

          if (this.filterBy === 'frequent') {

            this.items = this.items.filter(
              _item => this.user.frequentItems.includes(_item.id)
            );
          }

          if (this.searchText && this.searchText !== '') {

            this.items = FuseUtils.filterArrayByString(this.items, this.searchText);
          }

          this.items = this.items.map(item => new Item(item));

          this.onItemsChanged.next(this.items);
          resolve(this.items);
        }, reject);
    });
  }

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
    if (this.selectedItems.length > 0) {

      // get position in selected items array
      const index = this.selectedItems.indexOf(id);

      if (index !== -1) {

        // remove from array
        this.selectedItems.splice(index, 1);

        // trigger the next event
        this.onSelectedItemsChanged.next(this.selectedItems);

        // return
        return;
      }
    }

    // if we don't have it, push as selected
    this.selectedItems.push(id);

    // trigger the next event
    this.onSelectedItemsChanged.next(this.selectedItems);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {

    // if items are selected
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
    this.selectedItems = [];

    // if there is no filter, select all items
    if (filterParameter === undefined || filterValue === undefined) {

      // clear selected items array
      this.selectedItems = [];

      // push id of all items to selected items array
      this.items.map(item => {
        this.selectedItems.push(item.id);
      });
    }

    // trigger the next event
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
          this.getItems();

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
      this.http.post(`${this.actionUrl}/entity-items/${this.user.id}`, { ...userData })
        .subscribe(response => {

          // get user data again (async)
          this.getUserData();

          // get items again (async)
          this.getItems();

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
    this.selectedItems = [];

    // Trigger the next event
    this.onSelectedItemsChanged.next(this.selectedItems);
  }

  /**
   * Delete item
   *
   * @param item
   */
  deleteItem(item): void {

    // find position of item in array of items
    const itemIndex = this.items.indexOf(item);

    // remove it from array
    this.items.splice(itemIndex, 1);

    // trigger the next event
    this.onItemsChanged.next(this.items);
  }

  /**
   * Delete selected items
   */
  deleteSelectedItems(): void {

    // foreach item in array of selected items
    for (const itemId of this.selectedItems) {

      // find item
      const item = this.items.find(_item => _item.id === itemId);

      // get position in array of items
      const itemIndex = this.items.indexOf(item);

      // remove of array of items
      this.items.splice(itemIndex, 1);
    }

    // trigger the next event
    this.onItemsChanged.next(this.items);

    // deselect all items
    this.deselectItems();
  }

  /** TO DELETE ABOVE */

}
