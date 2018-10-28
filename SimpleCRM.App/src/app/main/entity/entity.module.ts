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
import { EntitiesGuard } from './guards/entities-can-activate.guard';
import { PaginationModule } from '@core/pagination';
import { ItemResolver } from './guards/item.resolver';
import { EditDetailsComponent } from './edit/edit-details/edit-details.component';
import { ConsultDetailsComponent } from './consult/consult-details/consult-details.component';

const routes: Route[] = [
  { // if no matching route -> redirect to Contacts's items list
    path        : '',
    redirectTo  : 'Contacts',
    pathMatch   : 'full'
  },
  { // entity's items list
    path        : ':entity',
    component   : EntityListComponent,
    canActivate : [EntitiesGuard]
  },
  { // consult item
    path        : ':entity/consult/:id',
    component   : EntityConsultComponent,
    canActivate : [EntitiesGuard],
    resolve     : { item: ItemResolver }
  },
  { // edit item
    path        : ':entity/edit/:id',
    component   : EntityEditComponent,
    canActivate : [EntitiesGuard],
    resolve     : { item: ItemResolver }
  },
  { // new item
    path        : ':entity/edit',
    component   : EntityEditComponent,
    canActivate : [EntitiesGuard],
    resolve     : { item: ItemResolver }
  },
];

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
    EntitiesGuard,
    EntityService,
    ItemResolver
  ]
})
export class EntityModule { }
