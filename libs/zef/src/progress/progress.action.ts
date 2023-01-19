import { createAction, union } from '@ngrx/store';

export const zefAddProgress = createAction(
  '[@zerops/zef/progress] add-progress',
  (
    key: string,
    id?: string | number,
    progress?: number,
    meta?: any
  ) => ({ key, id, progress, meta })
);

export const zefUpdateProgress = createAction(
  '[@zerops/zef/progress] update-progress',
  (
    key: string,
    id?: string | number,
    progress?: number,
  ) => ({ key, id, progress })
);

export const zefRemoveProgress = createAction(
  '[@zerops/zef/progress] remove-progress',
  (
    key: string,
    id?: string | number,
    progress?: number,
  ) => ({ key, id, progress })
);

const all = union({
  zefAddProgress,
  zefRemoveProgress,
  zefUpdateProgress
});

export type ZefProgressActionUnion = typeof all;
