import { PageEvent, Sort }    from '@angular/material';
import { Subject }            from 'rxjs';
import { PaginatorSelection } from '../classes/paginator-selection.class';
import { PaginationItemList } from '../models/pagination-items-list.type';
import { PaginationModel }    from '../models/pagination.model';

export class PaginationSettings<T> {

  private readonly dataAndCountSubject: Subject<PaginationItemList> = new Subject();

  private readonly model: PaginationModel = new PaginationModel();
  private readonly selection: PaginatorSelection<T> = new PaginatorSelection<T>(this.dataAndCountSubject);

  public get page(): number { return this.model.pageIndex + 1; }

  public get pageIndex(): number { return this.model.pageIndex; }

  public get selectItemsPerPage(): number[] { return this.model.selectItemsPerPage; }

  public get pageSize(): number { return this.model.pageSize; }

  public get sort(): string { return this.model.sort; }

  public get length(): number { return this.model.allItemsLength; }

  public get selectionLength(): number { return this.selection.selectionCount; }

  public loading: boolean;

  public update(options: PaginationItemList) {
    this.model.allItemsLength = options.Count;
    this.dataAndCountSubject.next(options);
  }

  public changePage(pageEvent: PageEvent): void {
    this.model.pageIndex      = pageEvent.pageIndex;
    this.model.pageSize       = pageEvent.pageSize;
  }

  public changeSort(sortEvent: Sort): void {
    this.model.sort = `${sortEvent.active} ${sortEvent.direction}`;
  }

  public toggleMasterSelection(): void {
    this.selection.toggleMaster();
  }

  public toggleChildSelection(row: T): void {
    this.selection.toggleChild(row);
  }

  public destroy(): void {
    this.dataAndCountSubject.complete();
    this.selection.destroy();
  }
}
