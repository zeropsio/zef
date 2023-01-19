import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZefErrorsState, ZefErrorHandlerType } from './errors.model';
import { FEATURE_NAME } from './errors.constant';
import isArray from 'lodash-es/isArray';

export const selectZefErrorsState = createFeatureSelector<ZefErrorsState>(FEATURE_NAME);

export const selectZefErrors = createSelector(
  selectZefErrorsState,
  (state) => state.errors
);

export const selectZefErrorByTypeAndId = (key: string, id: string) => createSelector(
  selectZefErrors,
  (state) => state.find((p) => p.key === key && id === id)
);

export const selectZefErrorByType = (key: string) => createSelector(
  selectZefErrors,
  (state) => state.find((p) => p.key === key)
);

export const selectZefErrorByErrorType = (type: ZefErrorHandlerType) => createSelector(
  selectZefErrors,
  (state) => state.filter((p) => p.errorType === type)
);

export const selectZefErrorsByType = (key: string | string[]) => createSelector(

  selectZefErrors,
  (state) => state.filter((p) => {
    if (isArray(key)) {
      return key.includes(p.key);
    } else {
      return p.key === key;
    }
  })
);

export const selectZefErrorMapByType = (key: string | string[]) => createSelector(
  selectZefErrors,
  (state) => state
    .filter((p) => !!p.id)
    .filter((p) => {
      if (isArray(key)) {
        return key.includes(p.key);
      } else {
        return p.key === key;
      }
    })
    .reduce((obj: any, p) => {
      if (!p.id) { return obj; }

      if (!obj[p.id]) {
        obj[p.id] = {};
      }

      obj[p.id][p.key] = p;

      return obj;
    }, {})
);
