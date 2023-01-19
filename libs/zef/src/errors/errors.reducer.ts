import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import { zefResetState, ZefResetStateAction } from '../core';
import { ZefErrorsState, ZefErrorHandlerType } from './errors.model';
import {
  zefAddError,
  zefRemoveError,
  ZefErrorsActionUnion
} from './errors.action';

const initialState = new ZefErrorsState();

const add = (
  state: ZefErrorsState,
  key: string,
  code: any,
  message: string,
  id?: string | number,
  originalError?: HttpErrorResponse,
  errorType?: ZefErrorHandlerType,
  originalAction?: any
): ZefErrorsState => ({
  ...state,
  errors: [
    ...state.errors,
    {
      code,
      message,
      errorType,
      originalAction,
      originalError,
      key,
      id
    }
  ]
});

const remove = (
  state: ZefErrorsState,
  key: string,
  id?: string | number
): ZefErrorsState => ({
  ...state,
  errors: state.errors.filter((item) => {
    if (id) { return item.id !== id && item.key === key; }
    return item.key !== key;
  })
});

const actionReducer = createReducer(
  initialState,
  on(
    zefAddError,
    (s, { key, code, message, originalError, id, errorType, originalAction }): ZefErrorsState => add(
      s,
      key,
      code,
      message,
      (originalAction && originalAction.data && originalAction.data.id)
        ? originalAction.data.id
        : id,
      originalError,
      errorType,
      originalAction
    )
  ),
  on(
    zefRemoveError,
    (s, { id, key }): ZefErrorsState => remove(s, key, id)
  ),
  on(zefResetState, () => initialState)
);

export function errorsReducer(
  state: ZefErrorsState,
  action: ZefErrorsActionUnion | ZefResetStateAction
) {
  return actionReducer(state, action);
}

