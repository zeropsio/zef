import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FEATURE_NAME } from './auth.constant';
import { AuthApiState } from './auth.model';

export const selectState = createFeatureSelector<AuthApiState>(FEATURE_NAME);

export const zefSelectAuthState = createSelector(
  selectState,
  (state) => state.state
);

export const zefSelectAuthData = createSelector(
  selectState,
  (state) => state.data
);

export const zefSelectAuthAccessToken = createSelector(
  zefSelectAuthData,
  (data) => data && data.accessToken
);
