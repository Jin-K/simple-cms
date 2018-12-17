import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { MatProgressSpinnerModule, MatTableModule, MatCheckboxModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { EntityListComponent } from './list/list.component';
import { EntityConsultComponent } from './consult/consult.component';
import { EntityEditComponent } from './edit/edit.component';
import { ListDetailsComponent } from './list/list-details/list-details.component';
import { EntityStoreModule } from './store/store.module';
import { EntityService } from './entity.service';
import { EntitiesActivableGuard } from './guards/entities-can-activate.guard';
import { PaginationModule } from '@core/pagination';
import { ItemResolver } from './guards/item.resolver';
import { EditDetailsComponent } from './edit/edit-details/edit-details.component';
import { ConsultDetailsComponent } from './consult/consult-details/consult-details.component';

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
   * @name /entity/:entity
   * Entity's items list
   * Could activate EntitiesActivableGuard to load entities
   * @param {string} entity
   */
  {
    path        : ':entity',
    component   : EntityListComponent,
    canActivate : [ EntitiesActivableGuard ]
  },
  /**
   * @name /entity/:entity/consult/:id
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
   * @name /entity/:entity/edit/:id
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
   * @name /entity/:entity/edit
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
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,

    PaginationModule,

    FuseSharedModule,

    EntityStoreModule
  ],
  declarations: [
    EntityListComponent,
    EntityConsultComponent,
    EntityEditComponent,
    ListDetailsComponent,
    EditDetailsComponent,
    ConsultDetailsComponent
  ],
  providers: [
    EntitiesActivableGuard,
    EntityService,
    ItemResolver
  ]
})
export class EntityModule { }
