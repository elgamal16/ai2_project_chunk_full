import type { CustomerQueryParams } from '../../api/analysis';
import type { CustomerRecord } from '../../api/types';

export interface FilterState extends CustomerQueryParams {
  page: number;
  page_size: number;
}

export interface CustomerDrawerState {
  isOpen: boolean;
  customer: CustomerRecord | null;
}

