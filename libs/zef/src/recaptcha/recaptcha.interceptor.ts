import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ZefHttpErrorResponse } from '../errors';
import {
  Observable,
  EMPTY,
  throwError,
  BehaviorSubject
} from 'rxjs';
import {
  catchError,
  filter,
  mergeMap,
  map,
  take
} from 'rxjs/operators';
import {
  setActive,
  setInactive
} from './recaptcha.action';

@Injectable()
export class RecaptchaInterceptor implements HttpInterceptor {

  private _recaptchaToken$ = new BehaviorSubject<string>(null);
  private _blocking = false;

  constructor(
    private _store: Store<any>,
    private _actions$: Actions
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    return next.handle(request).pipe(
      catchError((err: ZefHttpErrorResponse) => {
        if (err.status === 405 || err.status === 406) {

          if (!this._blocking) {
            this._blocking = true;
            this._recaptchaToken$.next(null);

            this._store.dispatch(setActive());

            return this._actions$.pipe(
              ofType(setInactive),
              mergeMap(({ token }) => {
                request = request.clone({
                  setHeaders: {
                    'g-recaptcha-response': token
                  }
                });

                return next
                  .handle(request)
                  .pipe(
                    catchError((errInner: ZefHttpErrorResponse) => {
                      if (errInner.code === 406) {
                        this._blocking = true;
                        this._store.dispatch(setActive());

                        return EMPTY;
                      } else {
                        this._blocking = false;
                        return throwError(errInner);
                      }
                    }),
                    map((res: any) => {
                      if (res.status && res.status === 200) {
                        this._recaptchaToken$.next(token);
                        this._blocking = false;
                      }

                      return res;
                    })
                  );
              })
            );

          } else {
            return this._recaptchaToken$.pipe(
              filter((token) => !!token),
              take(1),
              mergeMap(() => next.handle(request))
            );
          }

        } else {
          return throwError(err);
        }

      })
    );
  }
}

export const recaptchaInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: RecaptchaInterceptor,
  multi: true
};
