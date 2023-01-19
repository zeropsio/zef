import { Store, select, MemoizedSelector, createAction } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { denormalize } from 'normalizr';
import isArray from 'lodash-es/isArray';
import keys from 'lodash-es/keys';
import orderBy from 'lodash-es/orderBy';
import isString from 'lodash-es/isString';
import { zefActionPayload } from '../core';
import { ZefErrorConfig } from '../errors/errors.model';
import { ZefEntityAction, ZefEntityActionOptions } from './entity-manager.model';
import { ZefProgressConfig } from '../progress/progress.model';
import { ZefWebsocketService } from '../websocket';
import { getSubscriptionNameForFeature, getFeatureNameWithId } from './utils';
import { EntityOps } from './operations.constant';
import { createTag } from './action-creator.service';
import { selectEntities, selectEntityList, selectEntityListAdditionalInfo } from './entities.selector';
import { CollectionManagerService } from './collection-manager.service';

export class EntityService<E, A = E, U = E> {

  addOne = createAction(
    createTag(this.entityName, EntityOps.AddOne),
    (
      entity: Partial<A>,
      meta?:  Pick<ZefEntityActionOptions<E>, any> & Partial<ZefEntityActionOptions<E>>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      { ...entity },
      EntityOps.AddOne,
      meta,
      errorsConfig
    )
  );

  deleteOne = createAction(
    createTag(this.entityName, EntityOps.DeleteOne),
    (
      id: string | number,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) =>
    this._actionCreator(
      { id },
      EntityOps.DeleteOne,
      meta,
      errorsConfig
    )
  );

  restoreOne = createAction(
    createTag(this.entityName, EntityOps.RestoreOne),
    (
      id: string | number,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) =>
    this._actionCreator(
      { id },
      EntityOps.RestoreOne,
      meta,
      errorsConfig
    )
  );

  updateOne = createAction(
    createTag(this.entityName, EntityOps.UpdateOne),
    (
      id: string | number,
      changes: Partial<U>,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      { id, changes },
      EntityOps.UpdateOne,
      meta,
      errorsConfig
    )
  );

  getOne = createAction(
    createTag(this.entityName, EntityOps.GetOne),
    (
      id: string | number,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) =>
    this._actionCreator(
      { id },
      EntityOps.GetOne,
      meta,
      errorsConfig
    )
  );

  getAll = createAction(
    createTag(this.entityName, EntityOps.GetAll),
    (
      data?: any,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      data,
      EntityOps.GetAll,
      meta,
      errorsConfig
    )
  );

  searchAll = createAction(
    createTag(this.entityName, EntityOps.SearchAll),
    (
      data?: any,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      data,
      EntityOps.SearchAll,
      meta,
      errorsConfig
    )
  );

  subscribe = createAction(
    createTag(this.entityName, EntityOps.Subscribe),
    (
      subscriptionName: string,
      data?: any,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      {
        ...data,
        subscriptionName,
        disableOutput: true,
        wsOutputType: 'updateStream'
      },
      EntityOps.Subscribe,
      meta,
      errorsConfig
    )
  );

  updateSubscribe = createAction(
    createTag(this.entityName, EntityOps.UpdateSubscribe),
    (
      clientId: string | { clientId: string; name: string; },
      data?: any,
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>
    ) => this._actionCreator(
      {
        ...data,
        search: data && data.search
          ? [
            ...data.search,
            this._getClientIdSearchObject(clientId)
          ].filter((d) => d !== undefined)
          : [ this._getClientIdSearchObject(clientId) ],
        subscriptionName: getSubscriptionNameForFeature(this.entityName, 'update'),
        disableOutput: true,
        wsOutputType: 'updateStream',
        receiverId: this.wsService?.getReceiverId(),
      },
      EntityOps.UpdateSubscribe,
      meta,
      errorsConfig
    )
  );

  listSubscribe = createAction(
    createTag(this.entityName, EntityOps.ListSubscribe),
    (
      clientId: string | { clientId: string; name: string; },
      featureName: string | { name: string; id: string; } = '',
      data: any = {},
      meta?: Partial<ZefEntityActionOptions>,
      errorsConfig?: Partial<ZefErrorConfig>,
      progressConfig?: Partial<ZefProgressConfig>
    ) => this._actionCreator(
      {
        ...data,
        search: data.search
          ? [
            ...data.search,
            this._getClientIdSearchObject(clientId)
          ].filter((d) => d !== undefined)
          : [ this._getClientIdSearchObject(clientId) ],
        subscriptionName: getSubscriptionNameForFeature(
          this.entityName,
          'list',
          meta && meta.handleGlobally === false
            ? undefined
            : isString(featureName)
              ? featureName
              : featureName.name
        ),
        receiverId: this.wsService?.getReceiverId(),
        wsOutputType: 'listStream'
      },
      EntityOps.ListSubscribe,
      meta
        ? meta.handleGlobally !== false
          ? {
            tag: getFeatureNameWithId(featureName),
            handleGlobally: true,
            ...meta
          } : undefined
        : {
          tag: getFeatureNameWithId(featureName),
          handleGlobally: true
        },
      errorsConfig,
      progressConfig
    )
  );

  addToCache = createAction(
    createTag(this.entityName, EntityOps.AddToCache),
    (data: E[], meta?: Partial<ZefEntityActionOptions>) => ({
      data,
      meta,
      op: EntityOps.AddToCache,
      entityName: this.entityName
    })
  );

  addIdsToCache = createAction(
    createTag(this.entityName, EntityOps.AddIdsToCache),
    (data: string[], meta?: Partial<ZefEntityActionOptions>, totalHits?: number) => ({
      data,
      meta,
      op: EntityOps.AddIdsToCache,
      entityName: this.entityName,
      totalHits
    })
  );

  updateCache = createAction(
    createTag(this.entityName, EntityOps.UpdateCache),
    (data: Partial<E>[], meta?: Partial<ZefEntityActionOptions>) => ({
      data,
      meta,
      op: EntityOps.UpdateCache,
      entityName: this.entityName
    })
  );

  removeFromCache = createAction(
    createTag(this.entityName, EntityOps.RemoveFromCache),
    // _ = meta
    (id: string, _?: Partial<ZefEntityActionOptions>) => ({
      data: { id },
      op: EntityOps.RemoveFromCache,
      entityName: this.entityName
    })
  );

  removeIdsFromCache = createAction(
    createTag(this.entityName, EntityOps.RemoveIdsFromCache),
    (data: string[], meta?: Partial<ZefEntityActionOptions>, totalHits?: number) => ({
      data,
      meta,
      op: EntityOps.RemoveIdsFromCache,
      entityName: this.entityName,
      totalHits
    })
  );

  listReset = createAction(
    createTag(this.entityName, EntityOps.ListReset),
    (tag?: string | { name: string; id: string; }) => ({
      tag,
      op: EntityOps.ListReset,
      entityName: this.entityName
    })
  );

  private _schema$: Observable<any>;

  private _entities$ = this.store.pipe(select(selectEntities));

  constructor(
    public readonly entityName: string,
    public readonly store: Store<any>,
    public readonly collectionManager: CollectionManagerService,
    public readonly wsService?: ZefWebsocketService
  ) {
    this._schema$ = this.collectionManager.getSchema$(this.entityName);
  }

  list$(
    tag?: string | { name: string; id: string; },
    orderSelector?: Array<string | ((i: E) => any)>,
    orderDir?: Array<boolean | 'asc' | 'desc'>
  ) {
    return combineLatest([
      this.store.pipe(select(selectEntityList(this.entityName, getFeatureNameWithId(tag)))),
      this._entities$,
      this._schema$
    ]).pipe(
      map(([ ids, entities, entSchema ]) => {

        if ((!ids || !entities)) { return; }

        const d = this._denormalize(ids, entities, entSchema);

        if (orderSelector) {
          return orderBy(d, orderSelector, orderDir);
        } else {
          return d;
        }

      }),
      distinctUntilChanged()
    );
  }

  listAdditionalInfo$(tag?: string | { name: string; id: string; }) {
    return this.store.pipe(
      select(selectEntityListAdditionalInfo(this.entityName, getFeatureNameWithId(tag)),
      distinctUntilChanged()
    ));
  }

  entityById$(
    selectorOrId: MemoizedSelector<any, string> | string | number,
    disctingFn = (a: any, b: any) => a && b && (a as any).id !== (b as any).id
  ) {
    const baseStreams$ = [
      this._entities$,
      this._schema$
    ];

    const streams$ = typeof selectorOrId === 'string' || typeof selectorOrId === 'number'
      ? baseStreams$
      : [
        ...baseStreams$,
        this.store.pipe(select(selectorOrId)),
      ];

    return combineLatest(streams$).pipe(
      map(([ entities, entSchema, id ]) => {
        // filter not used on purpose.. TODO better comment later
        if (!entities || !entities[this.entityName]) { return undefined; }
        if (!id) {
          return this._denormalize([ selectorOrId as any ], entities, entSchema)[0];
        }
        return this._denormalize([ id ], entities, entSchema)[0];
      }),
      distinctUntilChanged(disctingFn)
    ) as Observable<E>;
  }

  listByIds$(selector: MemoizedSelector<any, string[]>) {
    return combineLatest([
      this.store.pipe(select(selector)),
      this._entities$,
      this._schema$
    ]).pipe(
      filter(([ ids, entities ]) => !!(ids && entities && entities[this.entityName])),
      map(([ ids, entities, entSchema ]) => this._denormalize(ids, entities, entSchema)),
      distinctUntilChanged()
    );
  }

  all$() {
    return combineLatest([
      this._entities$,
      this._schema$
    ])
    .pipe(
      map(([ entities, entSchema ]) => {
        const ent = entities[this.entityName];
        const ids = keys(ent).reduce((arr, id) => {
          arr.push(ent[id].id);
          return arr;
        }, []);

        return this._denormalize(ids, entities, entSchema);
      }),
      distinctUntilChanged()
    );
  }

  rawEntities$() {
    return this.store.pipe(
      select(selectEntities),
      map((entities) => entities[this.entityName] as { [id: string]: E; }),
      distinctUntilChanged()
    );
  }

  private _getClientIdSearchObject(clientId: string | { clientId: string; name: string; }) {
    if (!clientId) { return undefined; }
    if (isString(clientId)) {
      return {
        name: 'clientId',
        operator: 'eq',
        value: clientId
      };
    } else {
      return {
        name: clientId.name,
        operator: 'eq',
        value: clientId.clientId
      };
    }
  }

  private _denormalize(ids: string[] | string | number | number[], entities: any, entSchema: any) {
    const arrIds = isArray(ids) ? ids : [ ids ];

    if (entSchema) {
      return denormalize(
        arrIds,
        entSchema.list,
        entities
      ).filter((item: E) => !!item) as E[];
    }
  }

  private _actionCreator<D>(
    data: D,
    op: EntityOps,
    meta = {},
    errorsConfig: Partial<ZefErrorConfig> = {},
    progressConfig: Partial<ZefProgressConfig> = {}
  ): Partial<ZefEntityAction<D>> {
    return {
      ...zefActionPayload(
        { data, meta },
        {
          type: 'snack',
          ...errorsConfig,
        },
        { ...progressConfig }
      ),
      op,
      entityName: this.entityName
    };

  }
}
