/**
 * Common API Response and Error Types for InsuraHub
 */

export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string | string[];
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
