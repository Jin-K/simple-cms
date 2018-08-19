import { Component, OnInit, OnDestroy }               from '@angular/core';
import { SelectionModel }                             from '@angular/cdk/collections';
import { MatTableDataSource }                         from '@angular/material';
import { Dictionary }                                 from '@ngrx/entity';
import { Store }                                      from '@ngrx/store';
import { Subscription }                               from 'rxjs';
import { OidcSecurityService }                        from 'angular-auth-oidc-client';

import { EntidadStoreSelectors, EntidadStoreActions } from '../../../root-store/entidad';
import { IItem }                                      from '../../../models/interfaces';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy { // TODO: Check if we need to extend a new base class fetching all Entidades

  entity!: string;

  isAuthorizedSubscription!: Subscription;
  entidadesIsLoadedSubscription!: Subscription;
  itemsIsLoadedSubscription!: Subscription;
  routeEntidadSubscription!: Subscription;
  dataSubscription!: Subscription;

  isAuthorized = false;
  entidadesLoaded = false;
  itemsIsLoaded = false;

  displayedColumns: string[] = ['select', 'id', 'active', 'dCreate'];
  dataSource = new MatTableDataSource<IItem>();
  selectionsCache: Dictionary<SelectionModel<IItem>> = {};
  selection = new SelectionModel<IItem>(true, []);

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(this._onisAuthorized.bind(this));
    this.entidadesIsLoadedSubscription = this.store.select(EntidadStoreSelectors.selectIsLoaded)
      .subscribe(this._onEntidadesIsLoaded.bind(this));
    this.itemsIsLoadedSubscription = this.store.select(EntidadStoreSelectors.selectItemsIsLoaded)
      .subscribe(loaded => this.itemsIsLoaded = loaded);
    this.routeEntidadSubscription = this.store.select(EntidadStoreSelectors.selectRouterEntidad)
      .subscribe(this._onRouteEntidad.bind(this));
    this.dataSubscription = this.store.select(EntidadStoreSelectors.selectCurrentItems)
      .subscribe((items: IItem[]) => this.dataSource.data = items);
  }

  ngOnDestroy(): void {
    this.isAuthorizedSubscription.unsubscribe();
    this.entidadesIsLoadedSubscription.unsubscribe();
    this.itemsIsLoadedSubscription.unsubscribe();
    this.routeEntidadSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  _onEntidadesIsLoaded(loaded: boolean): void {
    this.entidadesLoaded = loaded;
    this._fetchItemsIfRequired();
  }

  _onisAuthorized(isAuthorized: boolean): void {
    this.isAuthorized = isAuthorized;
    if (this.isAuthorized && !this.entidadesLoaded) this.store.dispatch(new EntidadStoreActions.LoadAll());
  }

  _onRouteEntidad(entidad: string): void {
    this.entity = entidad;
    this._fetchItemsIfRequired();
    if (this.entity) {
      if (!this.selectionsCache[this.entity]) this.selectionsCache[this.entity] = new SelectionModel<IItem>(true, []);
      this.selection = this.selectionsCache[this.entity];
    }
  }

  _fetchItemsIfRequired(): void {
    if (this.entidadesLoaded && this.entity && !this.itemsIsLoaded) this.store.dispatch(new EntidadStoreActions.LoadAllItems(this.entity));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
