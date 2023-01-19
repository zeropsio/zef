import { Observable } from 'rxjs';
import { ZefActionBase } from '../core';
import { EntityOps } from './operations.constant';
import { MergeStrategy } from './utils';

export interface ZefEntitiesState {
  entities: { [key: string]: any; };
  list: {
    [key: string]: {
      items: string[],
      totalHits: number,
      offset: number,
      limit: number
    };
  };
}

export interface EntityManagerConfig {
  metadata?: { [name: string]: any; };
  config: {
    apiPrefix: string;
  };
}

export interface QueryParams {
  [name: string]: string | string[];
}
export interface Update<T> {
  id: string;
  changes: Partial<T>;
}

export interface ZefEntityActionOptions<E = any> {
  tag?: string;
  handleGlobally?: boolean;
  rawResult?: E;
  zefEntityMergeStrategy?: MergeStrategy | { [key: string]: MergeStrategy; };
  zefListMergeStrategy?: MergeStrategy | { [key: string]: MergeStrategy; };
  [key: string]: any;
}

export interface ZefEntityAction<D = any> extends ZefActionBase<D, Pick<ZefEntityActionOptions, any>
  & Partial<ZefEntityActionOptions>> {
  op: EntityOps;
  entityName: string;
  originalAction?: ZefEntityAction;
  type: string;
  totalHits?: number;
}

export interface ZefEntitySuccessAction<T> extends ZefEntityAction {
  data: T;
  type: string;
  meta?: ZefEntityActionOptions<T>;
}

export interface DataService<T> {
  readonly name: string;
  add(entity: T, meta?: any): Observable<T>;
  delete(id: string, meta?: any): Observable<string>;
  getAll(data: any, meta?: any): Observable<T[]>;
  searchAll(data: any, meta?: any): Observable<{ items: T[] }>;
  getById(id: any, meta?: any): Observable<T>;
  getWithQuery(params: QueryParams | string, meta?: any): Observable<T[]>;
  update(update: Update<T>, meta?: any): Observable<T>;
  restore(id: string, meta?: any): Observable<T>;
}

export interface ListAdditionalInfo {
  totalHits: number;
  offset: number;
  limit: number;
}
