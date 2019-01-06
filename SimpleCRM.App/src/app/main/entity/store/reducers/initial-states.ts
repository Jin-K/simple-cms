import { EntityAdapter, createEntityAdapter }                   from '@ngrx/entity';
import { SelectionIdsStrategy }                                 from './enums';
import { IEntitySelection, ElementsState, IEntityState }        from './interfaces';

// Entity adapter for entities
export const entityAdapter: EntityAdapter<IEntityState> = createEntityAdapter<IEntityState>({
  selectId: entity => entity.name,
  sortComparer: false
});

// Initial elements state (state.elements)
export const INITIAL_ELEMENTS_STATE: ElementsState = entityAdapter.getInitialState({
  loading: false
});

// Initial entity state (state.elements.entities.{name})
export const INITIAL_ENTITY_STATE: IEntityState = {
  id: null,
  name: null,
  filters: { category: 'all' },
  selection: {
    strategy: SelectionIdsStrategy.Normal
  }
};

// Entity selection state when all items are selected (state.elements.entities[].selection)
export const ALL_ITEMS_SELECTED_STATE: IEntitySelection = {
  strategy: SelectionIdsStrategy.Inversed
};
