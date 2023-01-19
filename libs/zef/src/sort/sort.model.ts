export interface Sort {
  key: string;
  direction: 'asc' | 'desc';
  label?: string;
}

export interface SortItem {
  key: string;
  label: string;
}

