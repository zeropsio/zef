import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataService, Update, QueryParams } from './entity-manager.model';
import { API_PREFIX } from './constants';

export class DefaultDataService<T> implements DataService<T> {
  protected _name: string;

  get name() {
    return this._name;
  }

  constructor(
    public entityName: string,
    private _http: HttpClient,
    private _apiPrefix: string
  ) {
    this._name = `${entityName} DefaultDataService`;
    this.entityName = entityName;
  }

  add(entity: T) {
    return this._http.post<T>(`${this._apiPrefix}/${this.entityName}`, entity);
  }

  delete(id: string) {
    return this._http.delete<string>(`${this._apiPrefix}/${this.entityName}/${id}`);
  }

  // TODO: interface
  getAll(data: any = {}) {
    return this._http.post<T[]>(
      `${this._apiPrefix}/${this.entityName}/list`,
      // TODO: temporary -> REMOVE
      {
        search: [{ ...data.search[0], type: 'match' }],
        sort: []
      }
    );
  }

  // TODO: interface
  searchAll(data: any = {}) {
    return this._http.post<{ items: T[] }>(
      `${this._apiPrefix}/${this.entityName}/search`,
      data
    );
  }

  suggest(text: string, search: any[], column?: string, source?: boolean) {
    return this._http.post<any>(
      `${this._apiPrefix}/${this.entityName}/suggest`,
      {
        text,
        source,
        search,
        column
      }
    );
  }

  getById(id: string) {
    return this._http.get<T>(`${this._apiPrefix}/${this.entityName}/${id}`);
  }

  getWithQuery(queryParams: QueryParams | string) {
    const qParams = typeof queryParams === 'string'
      ? { fromString: queryParams }
      : { fromObject: queryParams };
    const params = new HttpParams(qParams);

    return this._http.get<T[]>(`${this._apiPrefix}/${this.entityName}`, { params });
  }

  update(update: Update<T>) {
    return this._http.put<T>(`${this._apiPrefix}/${this.entityName}/${update.id}`, update.changes);
  }

  restore(id: string) {
    return this._http.put<T>(`${this._apiPrefix}/${this.entityName}/${id}/restore`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class DefaultDataServiceFactory {
  constructor(
    private _http: HttpClient,
    @Inject(API_PREFIX)
    private _apiPrefix: string
  ) { }

  create<T>(entityName: string): DataService<T> {
    return new DefaultDataService<T>(entityName, this._http, this._apiPrefix);
  }
}
