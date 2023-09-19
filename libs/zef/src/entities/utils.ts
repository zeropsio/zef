import { EntityOps, makeSuccessOp, makeErrorOp } from './operations.constant';
import isArray from 'lodash-es/isArray';
import { Action, createSelector } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { filter, mergeMap, map, withLatestFrom, switchMap, take } from 'rxjs/operators';
import { ZefEntitySuccessAction, ZefEntityAction, ZefEntityActionOptions } from './entity-manager.model';
import uniq from 'lodash-es/uniq';
import isString from 'lodash-es/isString';
import { Observable, of } from 'rxjs';
import { EntityService } from './entity-manager-entity.service';
import { onWebsocketSubscriptionName } from '../websocket';
import { showMoreEntities } from './entities.action';

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

  const nstate = { ...state };

  const _isEntityOp = (op: any) => isEntityOp(entity, op, action);

  const key = getEntityTagKey(entity, tag);

  if (_isEntityOp(makeSuccessOp(EntityOps.ListSubscribe))) {
    if (!nstate['subscriptions']['list']) {
      nstate['subscriptions']['list'] = {};
    }
    nstate['subscriptions']['list'][key] = true;
  }

  if (_isEntityOp(makeSuccessOp(EntityOps.UpdateSubscribe))) {
    if (!nstate['subscriptions']['update']) {
      nstate['subscriptions']['update'] = {};
    }
    nstate['subscriptions']['update'][key] = true;
  }

  console.log({ state, action, entity, tag, key });
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

  return `${name.name}+${name.id}`;
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
