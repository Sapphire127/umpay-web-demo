export enum Active {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface PageResponse<T> {
  hasNext: boolean;
  page: number;
  size: number;
  items: T[];
}

export interface StatusUpdateRequest {
  status: Active;
}

export interface PaginationParams {
  pageNum: number;
  pageSize: number;
}
