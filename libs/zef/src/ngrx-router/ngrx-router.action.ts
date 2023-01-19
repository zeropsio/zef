import { createAction, union } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const zefGo = createAction(
  '[@zerops/zef/ngrx-router] go',
  (
    path: any[],
    query?: Record<string, unknown>,
    extras?: NavigationExtras
  ) => ({ path, query, extras })
);

export const zefBack = createAction(
  '[@zerops/zef/ngrx-router] back'
);

export const zefForward = createAction(
  '[@zerops/zef/ngrx-router] forward'
);

export const zefSetId = createAction(
  '[@zerops/zef/ngrx-router] set-id',
  (
    key: string,
    id: string
  ) => ({ key, id })
);

export const zefResetId = createAction(
  '[@zerops/zef/ngrx-router] reset-id',
  (
    key: string
  ) => ({ key })
);

const all = union({
  zefGo,
  zefBack,
  zefForward,
  zefSetId,
  zefResetId
});
export type ZefNgrxRouterActionUnion = typeof all;
