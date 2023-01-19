import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZefProgressState, ZefProgressMap } from './progress.model';
import { FEATURE_NAME } from './progress.constant';
import isArray from 'lodash-es/isArray';

export const selectZefProgressState = createFeatureSelector<ZefProgressState>(FEATURE_NAME);

export const selectZefProgresses = createSelector(
  selectZefProgressState,
  (state) => state.progress
);

export const selectZefProgressByTypeAndId = (key: string, id: string) => createSelector(
  selectZefProgresses,
  (state) => state.find((p) => p.key === key && id === id)
);

export const selectZefProgressByTypeAndTag = (key: string, tag: string) => createSelector(
  selectZefProgresses,
  (state) => state.find((p) => p.key === key && tag === p.meta?.tag)
);

export const selectZefProgressByType = (key: string) => createSelector(
  selectZefProgresses,
  (state) => state.find((p) => p.key === key)
);

export const selectZefProgressesByType = (key: string | string[]) => createSelector(
  selectZefProgresses,
  (state) => {
    return state.filter((p) => {
      if (isArray(key)) {
        return key.includes(p.key);
      } else {
        return p.key === key;
      }
    });
  }
);

export const selectZefProgressMapByType = (type: string | string[]) => createSelector(
  selectZefProgresses,
  (state) => state
    .filter((p) => !!p.id)
    .filter((p) => {
      if (isArray(type)) {
        return type.includes(p.key);
      } else {
        return p.key === type;
      }
    })
    .reduce((obj: any, p) => {
      if (!p.id) { return obj; }

      if (!obj[p.id]) {
        obj[p.id] = {};
      }

      obj[p.id][p.key] = p;

      return obj;
    }, {}) as ZefProgressMap
);
