import { SelectionIdsStrategy }                                 from './enums';
import { EntitySelection, ElementsState, ElementsEntityState }  from './interfaces';
import { EntityAdapter, createEntityAdapter }                   from '@ngrx/entity';

// Entity adapter for entities
export const entityAdapter: EntityAdapter<ElementsEntityState> = createEntityAdapter<ElementsEntityState>({
  selectId: entity => entity.name,
  sortComparer: false
});

// Initial elements state (state.elements)
export const INITIAL_ELEMENTS_STATE: ElementsState = entityAdapter.getInitialState({
  loading: false
});

// Initial entity state (state.elements.entities.{name})
export const INITIAL_ENTITY_STATE: ElementsEntityState = {
  id: null,
  name: null,
  filters: { category: 'all' },
  selection: {
    strategy: SelectionIdsStrategy.Normal
  }
};

// Entity selection state when all items are selected (state.elements.entities[].selection)
export const ALL_ITEMS_SELECTED_STATE: EntitySelection = {
  strategy: SelectionIdsStrategy.Inversed
};
