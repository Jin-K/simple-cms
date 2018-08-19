import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store }                        from '@ngrx/store';
import { Observable, Subscription }     from 'rxjs';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import * as actions                     from '../../root-store/entidad/actions';
import { IItem }                        from '../../models/interfaces';
import { Contact }                      from '../../models/contact';
import { Action }                       from '../../models/action';
import { Company }                      from '../../models/company';
import * as EntidadStoreSelectors       from '../../root-store/entidad/selectors';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit, OnDestroy {

  items!: Observable<IItem[]>;

  entity!: string;

  isAuthorizedSubscription: Subscription;
  isLoadedSubscription: Subscription;
  routeEntidadSubscription: Subscription;

  isLoaded = false;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.isLoadedSubscription = this.store.select(EntidadStoreSelectors.selectIsLoaded)
      .subscribe(loaded => this.isLoaded = loaded);
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe((isAuthorized: boolean) => this.initStoreStuff(isAuthorized));
    this.routeEntidadSubscription = this.store.select(EntidadStoreSelectors.selectRouterEntidad)
      .subscribe(entidad => this.entity = entidad);
  }

  ngOnInit() {
    this.items = this.store.select(EntidadStoreSelectors.selectCurrentItems);
  }

  ngOnDestroy(): void {
    this.isLoadedSubscription.unsubscribe();
    this.isAuthorizedSubscription.unsubscribe();
    this.routeEntidadSubscription.unsubscribe();
  }

  addItem() {
    let newItem: IItem;

    // TODO: Remove this
    switch (this.entity) {
      case 'Contacts': newItem = new Contact('Muñoz', 'Pablo'); break;
      case 'Companies': newItem = new Company('Jin-K empire'); break;
      case 'Actions': newItem = new Action('Work !'); break;
      default: return;
    }

    this.store.dispatch(new actions.Create(newItem, this.entity ) );
  }

  updateEntidad(id: number) {
    this.store.dispatch( new actions.Update( id, this.entity, { dCreate: new Date() } ) );
  }

  deleteEntidad(id: number) {
    this.store.dispatch( new actions.Delete( id, this.entity ) );
  }

  initStoreStuff(isAuthorized: boolean) {
    if (!isAuthorized) return;
    console.log('Authorizé pour la section "entidades"');
    if (!this.isLoaded) this.store.dispatch(new actions.LoadAll());
  }
}
