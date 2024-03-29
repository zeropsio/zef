import { zefResetState } from '../core';
import mergeWith from 'lodash-es/mergeWith';
import isString from 'lodash-es/isString';
import {
  zefEntitiesListReducer,
  MergeStrategy,
  mergeByStrategy,
  getEntityTagKey,
  zefEntitiesSubscriptionsReducer,
} from './utils';
import { EntityOps } from './operations.constant';
import { ZefEntitiesState } from './entity-manager.model';

const initialState: ZefEntitiesState = {
  entities: {},
  lists: {},
  suggests: {},
  subscriptions: {
    list: undefined,
    update: undefined,
    mergeStrategies: {
      list: {},
      update: {}
    },
    active: {
      list: 0,
      update: 0
    },
    keys: {
      list: [],
      update: []
    }
  }
};

export function reducer(
  state = initialState,
  action: any
) {

  if (action.entityName && action.data && action.data.items && action.data.items.entities) {
    state = {
      ...state,
      entities: entitiesMerger(
        state.entities,
        action.data.items.entities,
        action?.originalAction?.meta?.zefEntityMergeStrategy
      )
    };
  }

  if (action.op === EntityOps.ListReset && action.entityName) {
    const key = getEntityTagKey(action.entityName, action.tag);
    state = {
      ...state,
      lists: {
        ...state.lists,
        [key]: {
          items: [],
          limit: undefined,
          offset: undefined,
          totalHits: undefined
        }
      }
    };
  }

  if (action.op === EntityOps.Suggest && action.entityName && !!action?.meta?.resetOnRequest) {
    const key = getEntityTagKey(action.entityName, action?.meta?.tag);
    state = {
      ...state,
      suggests: {
        ...state.suggests,
        [key]: undefined
      }
    };
  }

  if (action.op === EntityOps.SuggestSuccess && action.entityName) {
    const key = getEntityTagKey(action.entityName, action.originalAction?.meta?.tag);
    state = {
      ...state,
      suggests: {
        ...state.suggests,
        [key]: action.data
      }
    };
  }

  if (action.op === EntityOps.SuggestReset && action.entityName) {
    const key = getEntityTagKey(action.entityName, action.tag);
    state = {
      ...state,
      suggests: {
        ...state.suggests,
        [key]: undefined
      }
    };
  }

  state = zefEntitiesSubscriptionsReducer(
    state,
    action,
    action.entityName,
    // TODO: refactor to a flag on *any* request?
    action.originalAction
      ? action.originalAction.meta && action.originalAction.meta.handleGlobally
        ? action.originalAction.meta.tag
        : undefined
      : action.meta && action.meta.handleGlobally
        ? action.meta.tag
        : undefined
  );

  state = zefEntitiesListReducer(
    state,
    action,
    action.entityName,
    // TODO: refactor to a flag on *any* request?
    action.originalAction
      ? action.originalAction.meta && action.originalAction.meta.handleGlobally
        ? action.originalAction.meta.tag
        : undefined
      : action.meta && action.meta.handleGlobally
        ? action.meta.tag
        : undefined,
    action.originalAction && action.originalAction.meta
      ? action.originalAction.meta.zefListMergeStrategy
      : undefined
  );

  if (action.type === zefResetState.type) {
    return initialState;
  }

  return state;

}

export function entitiesMerger(oldVal: any, newVal: any, mergeStrategy?: MergeStrategy) {
  if (mergeStrategy && mergeStrategy === MergeStrategy.Noop) {
    return oldVal;
  }

  return mergeWith(
    {},
    oldVal,
    newVal,
    _customizer(mergeStrategy)
  );
}

function _customizer(mergeStrategy?: MergeStrategy) {
  return (objValue: any, srcValue: any, key: string) => {
    if (mergeStrategy && isString(mergeStrategy)) {
      return mergeByStrategy(mergeStrategy, objValue, srcValue);
    } else if (mergeStrategy && mergeStrategy[key]) {
      return mergeByStrategy(mergeStrategy[key], objValue, srcValue);
    }
  };
}
