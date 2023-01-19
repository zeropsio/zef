import { createAction, union } from '@ngrx/store';
import {
  zefActionPayload,
  zefActionFailPayload,
  zefActionSuccessPayload
} from '../core';

export const zefWebsocketAuth = createAction(
  '[@zerops/zef/websocket] auth',
  zefActionPayload<{ token: string; receiverId: string; }>()
);

export const zefWebsocketFail = createAction(
  '[@zerops/zef/websocket] auth/fail',
  zefActionFailPayload
);

export const zefWebsocketSuccess = createAction(
  '[@zerops/zef/websocket] auth/success',
  zefActionSuccessPayload<{
    token: string;
    receiverId: string;
  }>()
);

export const zefWebsocketMessage = createAction(
  '[@zerops/zef/websocket] message',
  (message: { type: string; data: any; subscriptionName: string; }) => ({ message })
);

export const zefWebsocketClosed = createAction(
  '[@zerops/zef/websocket] closed',
  (reason?: string) => ({ reason })
);

export const zefWebsocketOpened = createAction(
  '[@zerops/zef/websocket] opened'
);

export const zefWebsocketTerminate = createAction(
  '[@zerops/zef/websocket] terminate'
);

const all = union({
  zefWebsocketAuth,
  zefWebsocketFail,
  zefWebsocketSuccess,
  zefWebsocketMessage,
  zefWebsocketClosed,
  zefWebsocketOpened,
  zefWebsocketTerminate
});

export type ZefWebsocketActionUnion = typeof all;
