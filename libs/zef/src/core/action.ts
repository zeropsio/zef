/* eslint-disable @typescript-eslint/ban-types */
import { HttpErrorResponse } from '@angular/common/http';
import { createAction } from '@ngrx/store';
import { ZefProgressConfig } from '../progress';
import { ZefErrorConfig } from '../errors';

export const zefResetState = createAction(
  '[@zerops/zef/core] reset-state'
);

export type ZefResetStateAction = typeof zefResetState;

export interface ZefActionPayload<D = any, M = any> {
  data?: D;
  meta?: M;
}

export interface ZefActionBase<D = any, M = any> {
  data?: D;
  meta?: M;
  zefError?: Partial<ZefErrorConfig>;
  zefProgress?: Partial<ZefProgressConfig>;
  originalAction?: ZefAction | any;
}

export interface ZefAction extends ZefActionBase {
  type: string;
}

export function zefActionSuccessPayload<R = any, M = any>() {
  return (
    response: R,
    originalAction: any,
    meta?: M
  ) => ({ data: response, meta, originalAction });
}

export function zefActionFailPayload(
  error: HttpErrorResponse,
  originalAction: any,
  meta = {}
) {
  return {
    meta: {
      zefError: error,
      ...meta
    },
    originalAction
  };
}

export function zefActionPayload<D = any, M = any>(): (
  payload?: Object | ZefActionPayload<D, M>,
  errorConfig?: Partial<ZefErrorConfig> | boolean,
  progressConfig?: Partial<ZefProgressConfig> | boolean
) => ZefActionBase<D, M>;
export function zefActionPayload<D = any, M = any>(
  payload?: Object | ZefActionPayload<D, M>,
  errorConfig?: Partial<ZefErrorConfig> | boolean,
  progressConfig?: Partial<ZefProgressConfig> | boolean
): ZefActionBase<D, M>;
export function zefActionPayload<D = any, M = any>(
  payloadO?: Object | ZefActionPayload<D, M>,
  errorConfigO?: Partial<ZefErrorConfig> | boolean,
  progressConfigO?: Partial<ZefProgressConfig> | boolean
) {
  const rf = (
    payload?: Object | ZefActionPayload<D, M>,
    errorConfig: Partial<ZefErrorConfig> | boolean = { type: 'snack' },
    progressConfig: Partial<ZefProgressConfig> | boolean = {}
  ): ZefActionBase<D, M> => {

    let retObj: ZefActionPayload<D, M> = payload;
    if (retObj) {
      if (!retObj.meta) {
        if (retObj.data) {
          retObj = { data: retObj.data, meta: { } as M };
        } else {
          retObj = { data: retObj as D, meta: { } as M };
        }
      }
    } else {
      retObj = {};
    }

    const zefProgress = progressConfig
      ? { zefProgress: (progressConfig as Partial<ZefProgressConfig>) }
      : { };

    const zefError = errorConfig
      ? { zefError: (errorConfig as Partial<ZefErrorConfig>) }
      : { };

    return {
      ...zefProgress,
      ...zefError,
      ...retObj
    };
  };

  if (payloadO || errorConfigO || progressConfigO) {
    return rf(payloadO, errorConfigO, progressConfigO);
  }

  return rf;
}

export function zefCreateFromAction(action: any, nProps: any) {
  return {
    ...nProps,
    originalAction: action
  };
}


