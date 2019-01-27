/**
 * The main EntityViewSettings class.
 * Model for xhr responses @ GET /api/entity/list-view-settings/{userId}?entity={entityName}
 *
 * @export
 * @class EntityViewSettings
 */
export class EntityViewSettings {
  entity: string;
  id: number;
  pagination: {
    page: number,
    pageCount: 5 | 10 | 25 | 100,
    orderBy: string,
    totalCount: number
  };
  filters: {
    userId: number | null,
    category: 'all' | 'starred'
  };
}
