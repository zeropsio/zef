import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZefWebsocketState } from './websocket.model';
import { FEATURE_NAME } from './websocket.constant';

export const selectZefWebsocketState = createFeatureSelector<ZefWebsocketState>(FEATURE_NAME);

export const selectZefWebsocketReconnecting = createSelector(
  selectZefWebsocketState,
  (state) => state.reconnecting
);

export const selectZefWebsocketToken = createSelector(
  selectZefWebsocketState,
  (state) => state.token
);

export const selectZefWebsocketReceiverId = createSelector(
  selectZefWebsocketState,
  (state) => state.receiverId
);
