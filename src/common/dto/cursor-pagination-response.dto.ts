export class CursorPaginationResponseDto<T> {
  data: T[];
  cursor: {
    after: number | null;
  };
  count: number;
  next: string | null;
}
