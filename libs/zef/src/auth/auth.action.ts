import { createAction } from '@ngrx/store';
import {
  zefActionPayload,
  zefActionSuccessPayload,
  zefActionFailPayload
} from '../core';
import { TokenData } from './auth.model';

export const zefLogin = createAction(
  '[@zerops/zef/auth] login',
  zefActionPayload()
);

export const zefLoginFail = createAction(
  '[@zerops/zef/auth] login/fail',
  zefActionFailPayload
);

export const zefLoginSuccess = createAction(
  '[@zerops/zef/auth] login/success',
  zefActionSuccessPayload()
);

export const zefCheckStoredToken = createAction(
  '[@zerops/zef/auth] check-stored-token',
  (valid: boolean) => ({ valid })
);

export const zefCheckStoredTokenFail = createAction(
  '[@zerops/zef/auth] check-stored-token/fail'
);

export const zefCheckStoredTokenSuccess = createAction(
  '[@zerops/zef/auth] check-stored-token/success',
  (tokenData: TokenData) => tokenData
);

export const zefLogout = createAction(
  '[@zerops/zef/auth] logout'
);

export const zefApiLogout = createAction(
  '[@zerops/zef/auth] api-logout'
);

export const zefApiLogoutFail = createAction(
  '[@zerops/zef/auth] api-logout/fail'
);

export const zefApiLogoutSuccess = createAction(
  '[@zerops/zef/auth] api-logout/success'
);

export const zefSetToken = createAction(
  '[@zerops/zef/auth] set token data',
  (data: TokenData, meta?: any) => ({ data, meta })
);
