import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  OnDestroy,
  Input
}                                   from '@angular/core';
import { MatSort }                  from '@angular/material';
import { ActivatedRoute }           from '@angular/router';
import { Subject }                  from 'rxjs';
import { Observable }               from 'rxjs/internal/Observable';

import { PaginationSettings }       from '../../../core/classes/pagination-settings.class';
import { PaginationService }        from '../../../core/services/pagination.service';
import { PaginationItemList }       from '../../../core/models/pagination-items-list.type';
import { IItem }                    from '../../../models/interfaces';

/**
 * @title ??
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  @Input() paginationItems$: Observable<PaginationItemList>;

  @Output() deleteRow = new EventEmitter<IItem>();
  @Output() switchPage = new EventEmitter();
  @Output() changeSort = new EventEmitter();

  private componentDestroyed$ = new Subject<boolean>();

  displayedColumns = ['select', 'id', 'active', 'created', 'actions'];
  dataSource: IItem[] = [];
  paginationSettings: PaginationSettings<IItem>;

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService<IItem>
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.paginationSettings = this.paginationService.getPaginationSettings(params.entity));

    // don't bind the method because this.paginationSettings's instance is changing over time, just invoke it on each do()
    this.sort.sortChange
      .takeUntil(this.componentDestroyed$)
      .do(sort => this.paginationSettings.changeSort(sort))
      .do(this.changeSort)
      .subscribe();

    this.paginationItems$
      .takeUntil(this.componentDestroyed$)
      .do(this.fetchRecentPaginationData.bind(this))
      .subscribe();
  }

  fetchRecentPaginationData(options: PaginationItemList) {
    this.dataSource = options.Items;
    this.paginationSettings.update(options);
    this.paginationSettings.loading = false;
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
