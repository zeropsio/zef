import { Injectable } from '@angular/core';
import { schema } from 'normalizr';
import keys from 'lodash-es/keys';
import isArray from 'lodash-es/isArray';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan, map, filter } from 'rxjs/operators';

export interface Schema {
  entity: schema.Entity;
  list: schema.Array;
}

@Injectable({ providedIn: 'root' })
export class CollectionManagerService {
  private _schemas = {};

  private _schemasAction$ = new BehaviorSubject<{
    key?: string;
    data?: {
      [key: string]: {
        entity: schema.Entity,
        list: schema.Array
      }
    }
  }>({});

  private _schemas$ = this._schemasAction$.pipe(
    scan((obj, data: any) => {
      obj = {
        ...obj,
        ...data
      };
      return obj;
    }, {})
  );

  create(metadata: any) {
    const entityKeysArr = keys(metadata);

    entityKeysArr.forEach((key) => {
      const data = metadata[key];
      const config = data.config ? data.config : undefined;

      const entity = new schema.Entity(
        key,
        undefined,
        config
      );

      this._schemas[key] = {
        entity,
        list: new schema.Array(entity)
      };
    });

    entityKeysArr.forEach((key) => {
      const data = metadata[key];
      const definitions = data.definitions;

      if (definitions) {
        const definitionsKeysArr = keys(definitions);

        const { entity } = this.getSchema(key);

        const defineObj = definitionsKeysArr.reduce((obj, dKey) => {
          const definition = definitions[dKey];

          obj[dKey] = isArray(definition)
            ? this.getSchema(definition[0]).list
            : this.getSchema(definition).entity;

          return obj;
        }, {});

        entity.define(defineObj);

      }
    });

    this._schemasAction$.next(this._schemas);
  }

  getSchema$(key: string): Observable<Schema> {
    return this._schemas$.pipe(
      filter((s) => !!s && s[key]),
      map((schemas) => schemas[key])
    );
  }

  getSchema(key: string): Schema {
    return this._schemas[key];
  }

}
