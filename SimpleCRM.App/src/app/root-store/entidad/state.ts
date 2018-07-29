import { EntityState, createEntityAdapter, EntityAdapter }  from '@ngrx/entity';
import { IItem }                                            from '../../models/interfaces';
import { Contact }                                          from '../../models/contact';
import { Company }                                          from '../../models/company';

// states
export interface ItemsState extends EntityState<IItem> {
  id: string;
  name: string;
  selectedId: number;
}
export interface EntidadesState extends EntityState<ItemsState> {
  current: string;
  loading: boolean;
}

// adapters adapter
export const itemAdapter: EntityAdapter<IItem> = createEntityAdapter<IItem>();
export const entidadAdapter: EntityAdapter<ItemsState> = createEntityAdapter<ItemsState>();

// Default data / initial state
export const INITIAL_ENTIDADES_STATE: EntidadesState = entidadAdapter.getInitialState({
  current: 'Contacts',
  ids: ['Contacts', 'Companies', 'Actions'],
  loading: false,
  entities: {
    'Contacts': itemAdapter.getInitialState({
      id: '11',
      name: 'Contacts',
      selectedId: 2,
      ids: [1, 2],
      entities: {
        1: new Contact( 'Munoz', 'Angel' ),
        2: new Contact( 'Alvarez', 'Chita' )
      }
    }),
    'Companies': itemAdapter.getInitialState({
      id: '10',
      name: 'Companies',
      ids: [1],
      entities: {
        1: new Company( 'Intense Designing' )
      }
    }),
    'Actions': itemAdapter.getInitialState({
      id: '32',
      name: 'Actions'
    })
  }
} );
