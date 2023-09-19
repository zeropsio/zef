/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityOps, makeSuccessOp, makeErrorOp } from './operations.constant';
import isArray from 'lodash-es/isArray';
import { Action, createAction, createSelector } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { filter, mergeMap, map, withLatestFrom, switchMap, take } from 'rxjs/operators';
import { ZefEntitySuccessAction, ZefEntityAction, ZefEntityActionOptions } from './entity-manager.model';
import uniq from 'lodash-es/uniq';
import isString from 'lodash-es/isString';
import { Observable, of } from 'rxjs';
import { EntityService } from './entity-manager-entity.service';
import { onWebsocketSubscriptionName } from '../websocket';
import { showMoreEntities } from './entities.action';
import { createTag } from './action-creator.service';

export enum MergeStrategy {
  Append = 'append',
  Prepend = 'prepend',
  KeepNew = 'keep-new',
  KeepOld = 'keep-old',
  Noop = 'noop',
  Merge = 'merge',
  MergeUniq = 'merge-uniq',
  Remove = 'remove'
}

interface ParsedSubscription {
  entityName: string;
  uniqueKey?: string;
  id?: string;
  subscriptionType: string;
}

export function mergeByStrategy(
  strategy: MergeStrategy,
  objValue: any,
  srcValue: any
) {
  if (isArray(objValue)) {
    if (!strategy) {
      return [ ...srcValue ];
    }

    if (strategy === MergeStrategy.Noop) {
      return objValue;
    }

    if (strategy === MergeStrategy.Append) {
      return [ ...objValue, ...srcValue ];
    }

    if (strategy === MergeStrategy.MergeUniq) {
      return uniq([ ...objValue, ...srcValue ]);
    }

    if (strategy === MergeStrategy.KeepNew) {
      return [ ...srcValue ];
    }

    if (strategy === MergeStrategy.Remove) {
      return objValue.filter((val) => !srcValue.includes(val));
    }

  }
}

export const isEntityOp = (
  entityName: string,
  op: EntityOps[] | EntityOps,
  action: any
) => action.entityName
  && action.entityName === entityName
  && (isArray(op) ? op.includes(action.op) : op === action.op);

export const _ofEntityOp = (
  entityName: string,
  ops: EntityOps[] | EntityOps
) => (action: Action) => isEntityOp(
  entityName,
  ops,
  action
);

export const ofEntityOp = (
  entityName: string,
  ops: EntityOps[] | EntityOps
) => filter(_ofEntityOp(entityName, ops));

export const successOf = <D>(
  action: Action,
) => filter((a: ZefEntitySuccessAction<D>) => a.type === makeSuccessOp(action.type));

export const errorOf = <D>(
  action: Action,
) => filter((a: ZefEntityAction<D>) => a.type === makeErrorOp(action.type));

export const zefListKey = 'lists';

export const zefEntitiesSubscriptionsReducer = <S = any>(
  state: S,
  action: ZefEntityAction,
  entity: string,
  tag?: string
): S => {

  const originalSubscriptions = (state as any).subscriptions;

  const nstate: any = {
    ...state,
    subscriptions: {
      ...originalSubscriptions,
      list: originalSubscriptions.list ? { ...originalSubscriptions.list } : originalSubscriptions.list,
      update: originalSubscriptions.update ? { ...originalSubscriptions.update } : originalSubscriptions.update,
      active: { ...originalSubscriptions.active },
      mergeStrategies: {
        list: {
          ...originalSubscriptions.mergeStrategies.list
        },
        update: {
          ...originalSubscriptions.mergeStrategies.update
        }
      },
      keys: {
        list: [...originalSubscriptions.keys.list],
        update: [...originalSubscriptions.keys.update]
      }
    }
  };

  const _isEntityOp = (op: any) => isEntityOp(entity, op, action);

  const key = getEntityTagKey(entity, tag);

  if (_isEntityOp(makeSuccessOp(EntityOps.ListSubscribe))) {
    if (!nstate.subscriptions.list) {
      nstate.subscriptions.list = {};
    }
    if (!nstate.subscriptions.list[key]) {
      nstate.subscriptions.list[key] = true;
      nstate.subscriptions.active.list++;

      if (nstate.subscriptions.keys.list.indexOf(key) === -1) {
        nstate.subscriptions.keys.list.push(key);
      }

      if (action.originalAction?.meta?.zefListMergeStrategy) {
        nstate.subscriptions.mergeStrategies.list[key] = action.originalAction?.meta?.zefListMergeStrategy;
      }
    }
  }

  if (_isEntityOp(makeSuccessOp(EntityOps.UpdateSubscribe))) {
    if (!nstate.subscriptions.update) {
      nstate.subscriptions.update = {};
    }
    if (!nstate.subscriptions.update[key]) {
      nstate.subscriptions.update[key] = true;
      nstate.subscriptions.active.update++;

      if (nstate.subscriptions.keys.update.indexOf(key) === -1) {
        nstate.subscriptions.keys.update.push(key);
      }

      if (action.originalAction?.meta?.zefEntityMergeStrategy) {
        nstate.subscriptions.mergeStrategies.update[key] = action.originalAction?.meta?.zefEntityMergeStrategy;
      }
    }
  }

  return nstate;
}

// u add a delete, dělat jen pokud existuje merge
// merge jako takovej
export const zefEntitiesListReducer = <S = any>(
  state: S,
  action: ZefEntityAction,
  entity: string,
  tag?: string,
  mergeStrategy?: MergeStrategy
): S => {

  let nstate = { ...state };

  const _isEntityOp = (op: any) => isEntityOp(entity, op, action);

  const key = getEntityTagKey(entity, tag);

  const listItems = nstate[zefListKey] && nstate[zefListKey][key] && nstate[zefListKey][key]?.items
    ? nstate[zefListKey][key]?.items
    : [];

  if (_isEntityOp(makeSuccessOp(EntityOps.AddOne))) {
    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
      [key]: {
        ...nstate[zefListKey][key],
        items: (uniq([ ...listItems, action?.data?.items?.result?.[0]])).filter((itm) => itm !== undefined)
      }
    };
  }

  if (
    (
      _isEntityOp(makeSuccessOp(EntityOps.GetAll))
      || _isEntityOp(makeSuccessOp(EntityOps.SearchAll))
      || _isEntityOp(makeSuccessOp(EntityOps.ListSubscribe))
    )
    && action.originalAction
    && (action.originalAction.meta.tag === undefined || action.originalAction.meta.tag === tag)
    && action?.originalAction?.meta?.zefListMergeStrategy !== MergeStrategy.Noop
  ) {

    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
      [key]: {
        items: mergeByStrategy(
          mergeStrategy,
          listItems,
          action.data?.items && action.data?.items.result ? action.data.items.result : []
        ),
        totalHits: action.data?.totalHits,
        offset: action.data?.offset,
        limit: action.data?.limit
      }
    };
  }

  if (_isEntityOp(makeSuccessOp(EntityOps.DeleteOne))) {

    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
      [key]: {
        ...nstate[zefListKey][key],
        items: listItems.filter(
          (id: any) => id !== action.data.id
        )
      }
    };
  }


  if (
    _isEntityOp(EntityOps.AddToCacheDone)
    && action.originalAction.meta
    && action.originalAction.meta.tag === tag
  ) {

    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
      [key]: {
        ...nstate[zefListKey][key],
        items: [ ...action.data, ...nstate[zefListKey][key].items ]
      }
    };
  }


  if (
    _isEntityOp(EntityOps.AddIdsToCache)
    && action.meta
    && (action.meta.tag === tag || action.meta.handleGlobally)
  ) {

    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
        [key]: {
          ...nstate[zefListKey][key],
          items: uniq([ ...action.data, ...nstate[zefListKey][key].items ]),
          totalHits: action.totalHits
        }
    };
  }

  if (
    _isEntityOp(EntityOps.RemoveIdsFromCache)
    && action.meta
    && action.meta.tag === tag
  ) {

    nstate = initList(nstate, key);

    nstate[zefListKey] = {
      ...nstate[zefListKey],
      [key]: {
        ...nstate[zefListKey][key],
        items: listItems.filter(
          (id: any) => !action.data.includes(id)
        ),
        totalHits: action.totalHits
      }
    };
  }

  return nstate;
};

function initList(state: any, key: string) {
  if (!state[zefListKey]) {
    state[zefListKey] = {};
  }

  if (!state[zefListKey][key]) {
    state[zefListKey] = {
      ...state[zefListKey],
      [key]: {
        items: [],
        totalHits: undefined,
        offset: undefined,
        limit: undefined
      }
    };
  }
  return state;
}

export const selectZefEntitiesList = (
  state: any,
  entity: string,
  tag?: string
) => createSelector(
  state,
  (s) => s[zefListKey]
    ? s[zefListKey][getEntityTagKey(entity, tag)] && s[zefListKey][getEntityTagKey(entity, tag)].items
    : []
);

export const selectZefEntitiesListAdditionalInfo = (
  state: any,
  entity: string,
  tag?: string
) => createSelector(
  state,
  (s) => s[zefListKey]
    ?
    {
      totalHits: s[zefListKey][getEntityTagKey(entity, tag)] && s[zefListKey][getEntityTagKey(entity, tag)].totalHits as number,
      limit: s[zefListKey][getEntityTagKey(entity, tag)] && s[zefListKey][getEntityTagKey(entity, tag)].limit as number,
      offset: s[zefListKey][getEntityTagKey(entity, tag)] && s[zefListKey][getEntityTagKey(entity, tag)].offset as number
    }
    : undefined
);

export function getEntityTagKey(entity: string, tag: string) {
  return tag ? `${entity}__${tag}` : entity;
}

export const getFeatureNameWithId = (name: string | { name: string; id: string; }) => {
  if (!name) { return undefined; }

  if (isString(name)) { return name; }

  if (name.id) {
    return `${name.name}+${name.id}`;
  } else {
    return `${name.name}`;
  }
};

export const getSubscriptionNameForFeature = (
  entity: string,
  type: 'list' | 'update',
  feature?: string | { name: string; id: string; }
) => {
  if (type === 'list') {
    if (feature) {
      return `${entity}__${getFeatureNameWithId(feature)}__list-subscription`;
    } else {
      return `${entity}__list-subscription`;
    }
  }

  if (type === 'update') {
    return `${entity}__update-subscription`;
  }
};

export const onShowMore = <A extends Observable<any>>(
  entity: EntityService<any>,
  ukey: string,
  defaultLimit: number,
  idSelector?: Observable<any>
) => {
  const idObs$ = idSelector ? idSelector : of(undefined);

  return (source$: A) => source$.pipe(
    ofType(showMoreEntities),
    filter(({ key }) => key === ukey || !ukey),
    withLatestFrom(idObs$),
    switchMap(([ _, id ]) => entity
      .listAdditionalInfo$(id ? { name: ukey, id } : ukey)
      .pipe(
        map(({ limit, offset }) => ({ id, limit: limit + defaultLimit, offset: offset + defaultLimit, showMoreLoading: true })),
        take(1)
      )
    )
  ) as Observable<{ id: string; limit: number; offset: number; showMoreLoading: boolean; }>;
};

export const onWebsocketMessageDispatchAddRemoveEntities = (
  entity: EntityService<any>,
  feature?: string | { name: string; id: string; },
  handleGlobally = true,
  idSelector?: Observable<string>
) => {
  const idObs$ = idSelector ? idSelector : of(undefined);

  return (source$: Observable<Action>) => source$.pipe(
    onWebsocketSubscriptionName(getSubscriptionNameForFeature(
      entity.entityName,
      'list',
      feature
    )),
    withLatestFrom(idObs$),
    mergeMap(([ message, id ]) => [
      message.data.add && message.data.add.length
        ? entity.addIdsToCache(
          message.data.add,
          { tag: getFeatureNameWithId(id
            ? { name: (feature as string), id }
            : feature
          ), handleGlobally },
          message.totalHits
        )
        : undefined,
      message.data.delete && message.data.delete.length
        ? entity.removeIdsFromCache(
          message.data.delete,
          { tag: getFeatureNameWithId(id
            ? { name: (feature as string), id }
            : feature
          ), handleGlobally },
          message.totalHits
        )
        : undefined,
    ].filter((itm) => !!itm))
  ) as Observable<Action>;
};

export const onWebsocketMessageDispatchUpdateEntities = (
  entity: EntityService<any>,
  meta?: Partial<ZefEntityActionOptions<any>>
) => {
  return (source$: Observable<Action>) => source$.pipe(
    onWebsocketSubscriptionName(getSubscriptionNameForFeature(entity.entityName, 'update')),
    filter((message) => message.data.update && message.data.update.length),
    map((message) => entity.updateCache(message.data.update, meta))
  ) as Observable<Action>;
};

export const parseSubscriptionString = (str: string): ParsedSubscription | null => {
  const baseRegex = /^(.+)__(.+)__(list-subscription|update-subscription)$/;
  const simplerRegex = /^(.+)__(list-subscription|update-subscription)$/;
  let match = str.match(baseRegex);

  if (!match) {
    match = str.match(simplerRegex);
    if (match) {
      const [, entityName, subscriptionType] = match;
      return {
        entityName,
        subscriptionType,
      };
    }
    return null;
  }

  const [, entityName, uniqueKeyOrId, subscriptionType] = match;
  const [uniqueKey, id] = uniqueKeyOrId.split('+');

  return {
    entityName,
    uniqueKey, // Will be undefined if not present
    id,        // Will be undefined if not present
    subscriptionType,
  };
};

export const removeFromCacheActionCreator = (
  entityName: string,
  op = EntityOps.RemoveFromCache
) => createAction(
  createTag(entityName, op),
  // _ = meta
  (id: string, _?: Partial<ZefEntityActionOptions>) => ({
    data: { id },
    op,
    entityName
  })
);

export const removeIdsFromCacheActionCreator = (
  entityName: string,
  op = EntityOps.RemoveIdsFromCache
) => createAction(
  createTag(entityName, op),
  (data: string[], meta?: Partial<ZefEntityActionOptions>, totalHits?: number) => ({
    data,
    meta,
    op,
    entityName,
    totalHits
  })
);

export const updateCacheActionCreator = <E = any>(
  entityName: string,
  op = EntityOps.UpdateCache
) => createAction(
  createTag(entityName, op),
  (data: Partial<E>[], meta?: Partial<ZefEntityActionOptions>) => ({
    data,
    meta,
    op,
    entityName
  })
);

export const addIdsToCacheActionCreator = (
  entityName: string,
  op = EntityOps.AddIdsToCache
) => createAction(
  createTag(entityName, op),
  (data: string[], meta?: Partial<ZefEntityActionOptions>, totalHits?: number) => ({
    data,
    meta,
    op,
    entityName,
    totalHits
  })
);

export const addToCacheActionCreator = <E = any>(
  entityName: string,
  op = EntityOps.AddToCache
) => createAction(
  createTag(entityName, op),
  (data: E[], meta?: Partial<ZefEntityActionOptions>) => ({
    data,
    meta,
    op,
    entityName
  })
);
