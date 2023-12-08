/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { normalize } from 'normalizr';
import {
  filter,
  mergeMap,
  map,
  catchError,
  switchMap,
  take,
  distinctUntilChanged
} from 'rxjs/operators';
import { EntityStoreService } from './entity-store.service';
import { EntityOps, makeSuccessOp, makeErrorOp } from './operations.constant';
import { createFromAction } from './action-creator.service';
import { CollectionManagerService, Schema } from './collection-manager.service';
import { ZefEntityAction, DataService } from './entity-manager.model';
import isArray from 'lodash-es/isArray';
import { select, Store } from '@ngrx/store';
import { zefWebsocketMessage } from '../websocket';
import { selectSubscriptions } from './entities.selector';
import {
  addIdsToCacheActionCreator,
  getFeatureNameWithId,
  getSubscriptionNameForFeature,
  parseSubscriptionString,
  removeIdsFromCacheActionCreator,
  updateCacheActionCreator
} from './utils';

const ENTITY_OPS = [
  EntityOps.AddOne,
  EntityOps.DeleteOne,
  EntityOps.RestoreOne,
  EntityOps.GetOne,
  EntityOps.GetAll,
  EntityOps.SearchAll,
  EntityOps.ListSubscribe,
  EntityOps.UpdateOne
];

@Injectable()
export class EntityManagerEffect {

  private _onEntityOp$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => ENTITY_OPS.includes(action.op)),
    mergeMap((action) => {
      const { entityName, op, data, meta } = action;
      const service = this._dataService.getService(entityName);

      return this._entityOfApiCall(
        service,
        op,
        data,
        meta
      ).pipe(
        switchMap((result) => this._collectionManager.getSchema$(entityName).pipe(
          map((schema) => [ result, schema ]),
          take(1)
        )),
        map(([ result, schema ]) => createFromAction(action, {
          op: makeSuccessOp(action.op),
          data: result && ((result.items && result.items.length && result.items[0] && result.items[0].id) || result.id)
            ? this._normalize(this._getDataForNormalization(result), schema)
            // TODO: check what this affects
            : data ? { ...data } : {},
          meta: { rawResult: result }
        })),
        catchError((err) => of(createFromAction(action, {
          op: makeErrorOp(op),
          meta: { zefError: err }
        })))
      );

    })
  ));

  private _onSuggest$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => action.op === EntityOps.Suggest),
    switchMap((action) => {
      const { entityName, data } = action;

      const service = this._dataService.getService(entityName);

      return service.suggest(
        data.text,
        data.search,
        data.column,
        data.limit,
        data.source
      ).pipe(
        map((res) => createFromAction(action, {
          op: makeSuccessOp(action.op),
          data: res.items
        }),
        catchError((err) => of(createFromAction(action, {
          op: makeErrorOp(action.op),
          meta: { zefError: err }
        })))
      ));
    })
  ));

  private _onSubscribe$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => action.op === EntityOps.Subscribe),
    mergeMap((action) => {
      const { entityName, data } = action;

      const service = this._dataService.getService(entityName);

      return service.searchAll(data).pipe(
        map(() => createFromAction(action, {
          op: makeSuccessOp(action.op)
        }),
        catchError((err) => of(createFromAction(action, {
          op: makeErrorOp(action.op),
          meta: { zefError: err }
        })))
      ));
    })
  ));

  private _onUpdateSubscribe$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => action.op === EntityOps.UpdateSubscribe),
    mergeMap((action) => {
      const { entityName, data } = action;

      const service = this._dataService.getService(entityName);

      return service.searchAll(data).pipe(
        map(() => createFromAction(action, {
          op: makeSuccessOp(action.op)
        }),
        catchError((err) => of(createFromAction(action, {
          op: makeErrorOp(action.op),
          meta: { zefError: err }
        })))
      ));
    })
  ));

  private _onListSubscribeUpdate$ = createEffect(() => this._actions$.pipe(
    ofType(zefWebsocketMessage),
    filter((action: any) => action.message && !!action.message.subscriptionName),
    mergeMap((action) => this._store.pipe(
      select(selectSubscriptions),
      filter((d) => !!d.active.list || !!d.active.update),
      distinctUntilChanged((prev, curr) => {
        return prev.active.list === curr.active.list && prev.active.update === curr.active.update;
      }),
      take(1),
      map((d) => {
        const { message } = action;

        const {
          subscriptionType,
          entityName,
          id,
          uniqueKey
        } = parseSubscriptionString(message.subscriptionName);

        const [ subNameList, subNameUpdate ] = (['list', 'update'] as const).map((key) => getSubscriptionNameForFeature(
          entityName,
          key,
          { name: uniqueKey, id }
        ));

        if (d.list?.[subNameList] || d.update?.[subNameUpdate]) {
          return undefined;
        }

        const tag = getFeatureNameWithId({ name: uniqueKey, id });
        const tagWithEntity = `${entityName}__${getFeatureNameWithId({ name: uniqueKey, id })}`;

        if (subscriptionType === 'list-subscription') {
          return [
            message.data.add && message.data.add.length
              ? addIdsToCacheActionCreator(entityName)(
                message.data.add,
                {
                  tag,
                  handleGlobally: true
                },
                message.totalHits
              )
              : undefined,
            message.data.delete && message.data.delete.length
              ? removeIdsFromCacheActionCreator(entityName)(
                message.data.delete,
                {
                  tag,
                  handleGlobally: true,
                  zefListMergeStrategy: d.mergeStrategies.list[tagWithEntity]
                },
                message.totalHits
              )
              : undefined
          ].filter((itm) => !!itm);
        }

        if (subscriptionType === 'update-subscription') {
          return [
            updateCacheActionCreator(entityName)(
              message.data.update,
              { zefEntityMergeStrategy: d.mergeStrategies.update[tagWithEntity] }
            )
          ];
        }

        return undefined;
      })
    )),
    filter((d) => !!d),
    mergeMap((d) => d)
  ));

  private _onAddToCache$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => action.op === EntityOps.AddToCache),
    map((action) => {
      const { entityName, data } = action;
      const schema = this._collectionManager.getSchema(entityName);

      return createFromAction(action, {
        op: EntityOps.AddToCacheDone,
        data: this._normalize(data, schema)
      });
    })
  ));

  private _updateCache$ = createEffect(() => this._actions$.pipe(
    filter((action) => !!action.entityName),
    filter((action) => action.op === EntityOps.UpdateCache),
    map((action) => {
      const { entityName, data } = action;
      const schema = this._collectionManager.getSchema(entityName);

      return createFromAction(action, {
        op: EntityOps.UpdateCacheDone,
        data: this._normalize(data, schema)
      });
    })
  ));

  constructor(
    private _actions$: Actions<ZefEntityAction>,
    private _dataService: EntityStoreService,
    private _collectionManager: CollectionManagerService,
    private _store: Store<any>
  ) { }

  private _entityOfApiCall(
    service: DataService<any>,
    op: EntityOps,
    data: any,
    meta: any
  ) {
    switch (op) {
      case EntityOps.AddOne:
        return service.add(data, meta);
      case EntityOps.UpdateOne:
        return service.update(data, meta);
      case EntityOps.GetOne:
        return service.getById(data.id, meta);
      case EntityOps.GetAll:
        return service.getAll(data, meta);
      case EntityOps.SearchAll:
        return service.searchAll(data, meta);
      case EntityOps.ListSubscribe:
        return service.searchAll(data, meta);
      case EntityOps.DeleteOne:
        return service.delete(data.id, meta);
      case EntityOps.RestoreOne:
        return service.restore(data.id, meta);
    }

    console.warn('Unknown action in _entityOfApiCall.')
    return;
  }

  private _getDataForNormalization(data: any) {
    if (data.id) {
      return data;
    } else if (data.items) {
      return {
        items: data.items,
        offset: data.offset,
        totalHits: data.totalHits,
        limit: data.limit
      };
    }
  }

  private _normalize(result: any[] | any, schema: Schema) {
    const arrResults = result.items ? result.items : isArray(result) ? result : [ result ];
    return {
      items: normalize(arrResults, schema.list),
      offset: result.offset,
      totalHits: result.totalHits,
      limit: result.limit
    };
  }
}
