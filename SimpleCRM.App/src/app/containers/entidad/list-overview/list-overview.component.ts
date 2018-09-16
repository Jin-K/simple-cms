import { Component, OnInit }                from '@angular/core';
import { ActivatedRoute }                   from '@angular/router';
import { Store }                            from '@ngrx/store';
import { Observable }                       from 'rxjs';

import { PaginationItemList }               from '../../../core/models/pagination-items-list.type';
import { entidadActions, entidadSelectors } from '../../../root-store/entidad';
import { IItem }                            from '../../../models/interfaces';
import { ApplicationState }                 from '../../../root-store/application-state';

/**
 * @title ??
 */
@Component({
  selector: 'app-list-overview',
  templateUrl: './list-overview.component.html',
  styleUrls: ['./list-overview.component.scss']
})
export class ListOverviewComponent implements OnInit {
  entity: string;
  paginationItems$: Observable<PaginationItemList>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<ApplicationState>
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.entity = data.entity;
      this.paginate();
    });
    this.paginationItems$ = this.store.select(entidadSelectors.selectCurrentItems);
  }

  onDelete(item: IItem): void {
    console.log('delete item', item);
  }

  paginate() {
    this.store.dispatch(new entidadActions.Paginate(this.entity));
  }

}
