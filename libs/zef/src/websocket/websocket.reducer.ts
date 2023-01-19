import { createReducer, on } from '@ngrx/store';
import { ZefWebsocketState } from './websocket.model';
import {
  zefWebsocketFail,
  ZefWebsocketActionUnion,
  zefWebsocketClosed,
  zefWebsocketOpened,
  zefWebsocketSuccess
} from './websocket.action';
import { zefResetState } from '../core';

const initialState = new ZefWebsocketState();

const actionReducer = createReducer(
  initialState,
  on(
    zefWebsocketOpened,
    (s): ZefWebsocketState => ({
      ...s,
      reconnecting : false
    })
  ),
  on(
    zefWebsocketSuccess,
    (s, { data }): ZefWebsocketState => ({
      ...s,
      token: data.token,
      receiverId: data.receiverId
    })
  ),
  on(
    zefWebsocketFail,
    zefWebsocketClosed,
    (s): ZefWebsocketState => ({
      ...s,
      reconnecting : true
    })
  ),
  on(zefResetState, () => initialState)
);

export function websocketReducer(
  state: ZefWebsocketState,
  action: ZefWebsocketActionUnion
) {
  return actionReducer(state, action);
}
