import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ZefAuthApi } from './auth.api';
import {
  zefLoginSuccess,
  zefLoginFail,
  zefLogin,
  zefCheckStoredToken,
  zefCheckStoredTokenSuccess,
  zefCheckStoredTokenFail,
  zefLogout,
  zefApiLogout,
  zefApiLogoutSuccess,
  zefApiLogoutFail,
  zefSetToken
} from './auth.action';
import { AuthTokenStorageService } from './auth.utils';

@Injectable()
export class AuthEffect {

  private _initType = '[@zerops/zef/auth] effect-init';

  private _onLogin$ = createEffect(() => this._actions$.pipe(
    ofType(zefLogin),
    switchMap((action) => this._api
      .login$({
        ...action.data
      })
      .pipe(
        map((response) => zefLoginSuccess(
          response.tokenData,
          action,
          response.response
        )),
        catchError((err) => of(zefLoginFail(err, action)))
      )
    )
  ));

  private _onLoginSuccess$ = createEffect(() => this._actions$.pipe(
    ofType(zefLoginSuccess),
    map(({ data }) => zefSetToken(data, zefLoginSuccess.type))
  ));

  private _onSetToken$ = createEffect(() => this._actions$.pipe(
    ofType(zefSetToken),
    tap(({ data }) => this._tokenStorage.setToken(data))
  ), { dispatch: false });

  private _onInitTriggerTokenCheck$ = createEffect(() => this._actions$.pipe(
    ofType(this._initType),
    map(() => zefCheckStoredToken(this._tokenStorage.isValid()))
  ));

  private _onCheckToken$ = createEffect(() => this._actions$.pipe(
    ofType(zefCheckStoredToken),
    map(({ valid }) => {
      if (valid) {
        return zefCheckStoredTokenSuccess(this._tokenStorage.getToken());
      } else {
        return zefCheckStoredTokenFail();
      }
    })
  ));

  private _onLogout$ = createEffect(() => this._actions$.pipe(
    ofType(zefLogout),
    tap(() => this._tokenStorage.removeToken()),
    map(() => zefApiLogout())
  ));

  private _onApiLogout$ = createEffect(() => this._actions$.pipe(
    ofType(zefApiLogout),
    switchMap(() => this._api
      .logout$()
      .pipe(
        map(() => zefApiLogoutSuccess()),
        catchError(() => of(zefApiLogoutFail()))
      )
    )
  ));

  constructor(
    private _actions$: Actions<any>,
    private _api: ZefAuthApi,
    private _tokenStorage: AuthTokenStorageService
  ) { }

  ngrxOnInitEffects() {
    return { type: this._initType };
  }

}
