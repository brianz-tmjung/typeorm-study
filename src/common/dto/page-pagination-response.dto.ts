export class PagePaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  take: number;
  totalPages: number;
}
