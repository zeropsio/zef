import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { FEATURE_NAME, NGRX_ROUTER_IDS_FEATURE_NAME } from './ngrx-router.constant';
import { NgrxRouterActivatedRouteState, NgrxRouterState } from './ngrx-router.model';

export const selectZefNgrxRouterRootState = createFeatureSelector<RouterReducerState<NgrxRouterActivatedRouteState>>(FEATURE_NAME);

export const selectZefNgrxRouterNavigationId = createSelector(
  selectZefNgrxRouterRootState,
  (state) => state && state.navigationId
);

export const selectZefNgrxRouterState = createSelector(
  selectZefNgrxRouterRootState,
  (state) => state && state.state
);

export const selectZefNgrxRouterParams = createSelector(
  selectZefNgrxRouterState,
  (state) => state && state.params
);

export const selectZefNgrxRouterParamsId = createSelector(
  selectZefNgrxRouterParams,
  (params) => params && params['id']
);

export const selectZefNgrxRouterQueryParams = createSelector(
  selectZefNgrxRouterState,
  (state) => state && state.queryParams
);

export const selectZefNgrxRouterPath = createSelector(
  selectZefNgrxRouterState,
  (state) => state && state.path
);

export const selectZefNgrxRouterUrl = createSelector(
  selectZefNgrxRouterState,
  (state) => state && state.url
);

export const selectZefNgrxRouterDataByKey = (key: string) => createSelector(
  selectZefNgrxRouterState,
  (state) => state && state.data[key]
);

export const selectZefNgrxRouterIdsState = createFeatureSelector<NgrxRouterState>(NGRX_ROUTER_IDS_FEATURE_NAME);

export const selectZefNgrxRouterIdByKey = (key: string) => createSelector(
  selectZefNgrxRouterIdsState,
  (state) => state && state.idMap && state.idMap[key]
);
