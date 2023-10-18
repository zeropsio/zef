/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { ZefActionBase } from '../core';
import { EntityOps } from './operations.constant';
import { MergeStrategy } from './utils';

export interface ZefEntitiesState {
  entities: { [key: string]: any; };
  lists: {
    [key: string]: {
      items: string[],
      totalHits: number,
      offset: number,
      limit: number
    };
  };
  suggests: {
    [key: string]: {
      column: string;
      id: string;
      score: number;
      text: string;
      textHighlight: string;
      title: string;
    }[];
  };
  subscriptions: {
    list: undefined | { [key: string]: boolean; };
    update: undefined | { [key: string]: boolean; };
    mergeStrategies: {
      list: { [key: string]: MergeStrategy; };
      update: { [key: string]: MergeStrategy; };
    };
    active: {
      list: number;
      update: number;
    };
    keys: {
      list: string[];
      update: string[];
    }
  }
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
  suggest(text: string, search: any[], column?: string, source?: boolean): Observable<any>;
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
