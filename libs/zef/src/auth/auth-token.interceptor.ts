import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HttpStatusCodes } from '../core';
import { Observable,  BehaviorSubject, throwError } from 'rxjs';
import { filter, catchError, switchMap, finalize, take  } from 'rxjs/operators';
import { ZefAuthApi } from './auth.api';
import { AuthTokenStorageService } from './auth.utils';
import { TokenData } from './auth.model';
import {
  zefRefreshToken,
  zefRefreshTokenFail,
  zefRefreshTokenSuccess
} from './refresh-token.action';

@Injectable()
export class AuthAndRefreshTokenInterceptor implements HttpInterceptor {
  private _isRefreshingToken = false;
  private _activeRequests = 0;
  private _tokenSubject$ = new BehaviorSubject<string>(undefined);

  constructor(
    private _api: ZefAuthApi,
    private _store: Store<any>,
    private _tokenService: AuthTokenStorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const _tokenData = this._tokenService.getToken();

      return next.handle(this._addToken(
        req,
        _tokenData ? _tokenData.accessToken : undefined
      )).pipe(
        catchError((err: HttpErrorResponse) => {
          console.log({
            status: err.status,
            url: req.url,
            activeRequests: this._activeRequests,
            isRefreshing: this._isRefreshingToken
          });

          if (err.status === HttpStatusCodes.UNAUTHORIZED) {
            this._activeRequests = this._activeRequests + 1;

            if (!this._isRefreshingToken) {
              this._isRefreshingToken = true;

              const refreshTokenAction = zefRefreshToken(undefined, {
                type: 'dialog'
              });

              this._store.dispatch(refreshTokenAction);

              // Reset here so that the following requests wait until the token
              // comes back from the refreshToken call.
              this._tokenSubject$.next(undefined);

              return this._api
                .refresh$<TokenData>(_tokenData.refreshToken)
                .pipe(
                  switchMap((tokenData) => {
                    this._tokenSubject$.next(tokenData.accessToken);

                    this._store.dispatch(zefRefreshTokenSuccess(
                      tokenData,
                      refreshTokenAction
                    ));

                    this._tokenService.setToken(tokenData);

                    return next.handle(this._addToken(req, tokenData.accessToken));
                  }),
                  // If there is an exception calling 'refreshToken', bad news so logout.
                  catchError((innerErr: HttpErrorResponse) => {
                    this._store.dispatch(zefRefreshTokenFail(
                      innerErr,
                      refreshTokenAction
                    ));

                    console.log('zefRefreshTokenFail', innerErr);

                    this._isRefreshingToken = false;

                    return throwError(err);
                  }),
                  filter((d) => !!d),
                  finalize(() => {
                    this._activeRequests = this._activeRequests - 1;

                    if (this._activeRequests === 0) {
                      this._isRefreshingToken = false;
                    }
                  })
                );
            } else {
              return this._tokenSubject$.pipe(
                filter((token) => !!token),
                take(1),
                switchMap((token) => {
                  return next.handle(this._addToken(req, token));
                })
              );
            }
          } else {
            return throwError(err);
          }
        })
      );
  }

  private _addToken(req: HttpRequest<any>, token: string) {
    if (!req.headers.get('zefSkipAuthHeader')) {
      if (!token) {
        return req;
      }
      return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
    }

    const newHeaders = req.headers.delete('zefSkipAuthHeader')
    return req.clone({ headers: newHeaders });
  }

}

export const authTokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthAndRefreshTokenInterceptor,
  multi: true
};
