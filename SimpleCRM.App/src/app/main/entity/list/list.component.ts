import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PaginationItemList } from '@core/pagination';
import { IItem } from 'app/models';

import { entityActions, entitySelectors } from '../store';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EntityListComponent implements OnInit {

  entity: string;
  paginationItems$: Observable<PaginationItemList<IItem>>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({entity}) => {
      this.entity = entity;
      this.paginate();
    });
    this.paginationItems$ = this.store.select(entitySelectors.selectCurrentItems);
  }

  onDelete(item: IItem): void {

  }

  paginate(): void {
    this.store.dispatch(new entityActions.Paginate(this.entity));
  }


}
