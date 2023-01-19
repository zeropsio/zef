import { AuthApiState, ZefAuthState } from './auth.model';
import { ZefAction, zefResetState } from '../core';
import { createReducer, on } from '@ngrx/store';
import {
  zefCheckStoredTokenSuccess,
  zefCheckStoredTokenFail,
  zefLogout,
  zefSetToken
} from './auth.action';

const initialState = new AuthApiState();

const actionReducer = createReducer(
  initialState,
  on(
    zefSetToken,
    (_, { data }): AuthApiState => ({
      state: ZefAuthState.Authorized,
      data
    })
  ),
  on(
    zefCheckStoredTokenSuccess,
    (_, data): AuthApiState => ({
      state: ZefAuthState.Authorized,
      data
    })
  ),
  on(
    zefCheckStoredTokenFail,
    zefLogout,
    (): AuthApiState => ({
      ...initialState,
      state: ZefAuthState.Invalid
    })
  ),
  on(zefResetState, () => ({
    ...initialState,
    state: ZefAuthState.Invalid
  }))
);

export function authReducer(
  state = initialState,
  action: ZefAction
) {
  return actionReducer(state, action);
}
