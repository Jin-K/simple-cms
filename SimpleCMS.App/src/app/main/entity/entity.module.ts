import { NgModule }                                   from '@angular/core';
import { RouterModule, Route }                        from '@angular/router';
import {
  MatProgressSpinnerModule,
  MatTableModule,
  MatCheckboxModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatDialogModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatRippleModule,
  MatInputModule,
  MatSlideToggleModule
}                                                     from '@angular/material';

import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { FuseSharedModule }                           from '@fuse/shared.module';
import { PaginationModule }                           from '@core/pagination';

import { EntityStoreModule }                          from './store/store.module';
import { EntityService }                              from './entity.service';
import { EntitiesActivableGuard }                     from './guards/entities-can-activate.guard';
import { ItemResolver }                               from './guards/item.resolver';
import { EntityListComponent }                        from './list/list.component';
import { ListDetailsComponent }                       from './list/list-details/list-details.component';
import { EntityItemsListDetailsComponent }            from './list/entity-items-list-details/entity-items-list-details.component';
import { EntityItemsListItemFormDialogComponent }     from './list/entity-items-list-item-form/entity-items-list-item-form.component';
import { SelectedBarComponent }                       from './list/selected-bar/selected-bar.component';
import { MainComponent }                              from './list/sidebars/main/main.component';
import { EntityEditComponent }                        from './edit/edit.component';
import { EditDetailsComponent }                       from './edit/edit-details/edit-details.component';
import { EntityConsultComponent }                     from './consult/consult.component';
import { ConsultDetailsComponent }                    from './consult/consult-details/consult-details.component';

/**
 * Routes for the entity module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const routes: Route[] = [

  /**
   * @name /entity
   * Base route, if no matching route -> redirect to Contacts's items list
   */
  {
    path        : '',
    redirectTo  : 'Contacts',
    pathMatch   : 'full'
  },
  /**
   * @name /:entity
   * Entity's items list
   * Could activate EntitiesActivableGuard to load entities
   * Resolves items with EntityService
   * @param {string} entity
   */
  {
    path        : ':entity',
    component   : EntityListComponent,
    canActivate : [ EntitiesActivableGuard ],
    resolve     : { items: EntityService }
  },
  /**
   * @name /:entity/consult/:id
   * Consult item.
   * Could activate EntitiesActivableGuard to load entities
   * Resolves data with ItemResolver
   * @param {string} entity
   * @param {string} id
   */
  {
    path        : ':entity/consult/:id',
    component   : EntityConsultComponent,
    canActivate : [ EntitiesActivableGuard ],
    resolve     : { item: ItemResolver }
  },
  /**
   * @name /:entity/edit/:id
   * Edit item
   * Could activate EntitiesActivableGuard to load entities
   * Resolves data with ItemResolver
   * @param {string} entity
   * @param {string} id
   */
  {
    path        : ':entity/edit/:id',
    component   : EntityEditComponent,
    canActivate : [ EntitiesActivableGuard ],
    resolve     : { item: ItemResolver }
  },
  /**
   * @name /:entity/edit
   * New item
   * Could activate EntitiesActivableGuard to load entities
   * Resolves data with ItemResolver
   * @param {string} entity
   */
  {
    path        : ':entity/edit',
    component   : EntityEditComponent,
    canActivate : [ EntitiesActivableGuard ],
    resolve     : { item: ItemResolver }
  },

];

/**
 * The main EntityModule class
 *
 * @export
 * @class EntityModule
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),

    // Material modules
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatTableModule,
    MatToolbarModule,

    PaginationModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,

    EntityStoreModule
  ],
  declarations: [
    EntityListComponent,
    EntityConsultComponent,
    EntityEditComponent,
    ListDetailsComponent,
    EditDetailsComponent,
    ConsultDetailsComponent,
    SelectedBarComponent,
    MainComponent,
    EntityItemsListDetailsComponent,
    EntityItemsListItemFormDialogComponent
  ],
  providers: [
    EntityService,
    EntitiesActivableGuard,
    ItemResolver
  ],
  entryComponents: [
    EntityItemsListItemFormDialogComponent
  ]
})
export class EntityModule { }
