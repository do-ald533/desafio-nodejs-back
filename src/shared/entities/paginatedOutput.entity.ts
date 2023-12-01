export class PaginatedOutputEntity<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    limit: number;
    prev: number | null;
    next: number | null;
  };
}
