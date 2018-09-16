export interface PaginatorOptions {
  order: string;
  sort: string;
  page: number;
  limit: number;
  count: number;
}

export const DEFAULT_PAGINATOR_OPTIONS: PaginatorOptions = {
  order: 'asc',
  sort: 'created',
  page: 0,
  limit: 5,
  count: 0
};
