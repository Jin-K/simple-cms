import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material';
import { Component, OnInit, OnDestroy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PaginationItemList, PaginationSettings, PaginationService } from '@core/pagination';
import { IItem } from 'app/models';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  @Input() paginationItems$: Observable<PaginationItemList<IItem>>;

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

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  fetchRecentPaginationData(options: PaginationItemList<IItem>) {
    this.dataSource = options.Items;
    this.paginationSettings.update(options);
    this.paginationSettings.loading = false;
  }

}
