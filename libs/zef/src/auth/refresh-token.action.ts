import { createAction } from '@ngrx/store';
import {
  zefActionFailPayload,
  zefActionPayload,
  zefActionSuccessPayload
} from '../core';

export const zefRefreshToken = createAction(
  '[@zerops/zef/auth] refresh-token',
  zefActionPayload()
);

export const zefRefreshTokenFail = createAction(
  '[@zerops/zef/auth] refresh-token/fail',
  zefActionFailPayload
);

export const zefRefreshTokenSuccess = createAction(
  '[@zerops/zef/auth] refresh-token/success',
  zefActionSuccessPayload()
);
