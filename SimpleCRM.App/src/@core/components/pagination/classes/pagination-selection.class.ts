import { SelectionModel }         from '@angular/cdk/collections';
import { Subject, Subscription }  from 'rxjs';
import { ItemsSelectionState } from '../../../oop/items-selection-state.enum';
import { PaginationItemList } from '../types';

export class PaginationSelection<T> extends SelectionModel<T> {

  private state: ItemsSelectionState = ItemsSelectionState.NoneSelected;
  private exceptions = new Set<T>();

  private _selectionCount = 0;
  private itemsCount = 0;
  private dataSlice: T[] = [];
  private dataAndCountSubscription: Subscription;

  public get selectionCount(): number { return this._selectionCount; }
  public get isAllSelected(): boolean { return !this.hasExceptions && this._selectionCount === this.itemsCount; }

  private get hasSelection(): boolean { return super.hasValue() || this.selectionCount > 0; }
  private get hasExceptions(): boolean { return !!this.exceptions.size; }

  constructor(private dataAndCountSubject: Subject<PaginationItemList<T>>) {
    super(true, []);
    this.dataAndCountSubscription = this.dataAndCountSubject.subscribe(this.onPaginated.bind(this));
  }

  public destroy(): void {
    this.dataAndCountSubscription.unsubscribe();
  }

  public toggleChild(row: T): void {
    const checked = this.toggle(row);

    switch (this.state) {
      case ItemsSelectionState.AllSelected:
        if (this.hasSelection) {
          this.addException(row);
          this.state = ItemsSelectionState.Indeterminate;
        }
        else this.clear();
        break;
      case ItemsSelectionState.NoneSelected:
        if (checked) this.removeException(row);
        this.state = this.selected.length === this.itemsCount ? ItemsSelectionState.AllSelected : ItemsSelectionState.Indeterminate;
        break;
      case ItemsSelectionState.Indeterminate:
        if (checked) {
          this.removeException(row);
          if (this.isAllSelected) this.state = ItemsSelectionState.AllSelected;
        }
        else this.addException(row);
        if (!this.hasSelection) this.state = ItemsSelectionState.NoneSelected;
        break;
    }
  }

  public toggle(row: T): boolean {
    super.toggle(row);
    const checked = super.isSelected(row);
    checked ? this._selectionCount++ : this._selectionCount--;
    return checked;
  }

  public toggleMaster(): void {
    this.state === ItemsSelectionState.AllSelected ? this.clear() : this.selectAll();
  }

  public clear(): void {
    super.clear();
    this.clearExceptions();
    this._selectionCount = 0;
    this.state = ItemsSelectionState.NoneSelected;
  }

  public selectAll(): void {
    this.clearExceptions();
    this.dataSlice.forEach(row => super.select(row));
    this._selectionCount = this.itemsCount;
    this.state = ItemsSelectionState.AllSelected;
  }

  private onPaginated(paginatedItemsList: PaginationItemList<T>) {
    const oldItems = this.dataSlice;
    const newItems = paginatedItemsList.Items as any[];

    this.dataSlice = newItems;
    this.itemsCount = paginatedItemsList.Count;
    this.refresh(oldItems);
  }

  private refresh(oldItems: T[]): void {
    switch (this.state) {
      case ItemsSelectionState.NoneSelected:
        this.clear();
        break;
      case ItemsSelectionState.AllSelected:
        this.selectAll();
        break;
      case ItemsSelectionState.Indeterminate:
        const notSelectedAndDissapearing = oldItems.filter(item => this.dataSlice.indexOf(item) === -1 && !super.isSelected(item));
        notSelectedAndDissapearing.forEach(item => this.addException(item));
        if (this.hasExceptions && this.exceptions.size + this.selectionCount === this.itemsCount)
          this.dataSlice.filter(row => !this.isException(row)).forEach(row => super.select(row));
        break;
    }
  }

  private addException(row: T): void { this.exceptions.add(row); }

  private clearExceptions(): void { if (this.exceptions.size) this.exceptions.clear(); }

  private isException(row: T): boolean { return this.exceptions.has(row); }

  private removeException(exception: T): void { this.exceptions.delete(exception); }
}
