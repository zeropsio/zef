import { createAction, union } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ZefErrorHandlerType } from './errors.model';

export const zefAddError = createAction(
  '[@zerops/zef/errors] add-error',
  (
    key: string,
    code: any,
    message: string,
    id?: string | number,
    originalError?: HttpErrorResponse,
    errorType?: ZefErrorHandlerType,
    originalAction?: any
  ) => ({ key, id, code, message, originalError, errorType, originalAction })
);

export const zefRemoveError = createAction(
  '[@zerops/zef/errors] remove-error',
  (
    // TODO: support `string[]`
    key: string,
    id?: string
  ) => ({ key, id })
);

const all = union({ zefAddError, zefRemoveError });
export type ZefErrorsActionUnion = typeof all;
