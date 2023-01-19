import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import isString from 'lodash-es/isString';
import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';
import {
  errorCodeExtractor,
  ErrorExtractorFn,
  errorMessageExtractor
} from './errors.utils';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(
    @Inject(errorCodeExtractor)
    private _errCodeExtractor: ErrorExtractorFn,
    @Inject(errorMessageExtractor)
    private _errMessageExtractor: ErrorExtractorFn
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          let errType: 'string' | 'object' | 'array';

          if (isString(err.error)) {
            errType = 'string';
          }

          if (isObject(err.error)) {
            errType = 'object';
          }

          if (isArray(err.error)) {
            errType = 'array';
          }

          return throwError({
            code: this._errCodeExtractor(err),
            message: this._errMessageExtractor(err),
            status: err.status,
            originalError: err,
            errType
          });
        })
      );
  }
}
