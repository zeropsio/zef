import { createReducer, on } from '@ngrx/store';
import { ZefAction, zefResetState } from '../core';
import { ZefProgressState } from './progress.model';
import { zefAddProgress, zefRemoveProgress, zefUpdateProgress } from './progress.action';

const initialState = new ZefProgressState();

const add = (
  state: ZefProgressState,
  key: string,
  id?: string | number,
  meta?: any,
  progress = 0
) => ({
  ...state,
  progress: [
    ...state.progress,
    { key, id, progress, meta }
  ]
});

const update = (
  state: ZefProgressState,
  key: string,
  id?: string | number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  progress = 0
) => ({
  ...state
});

const remove = (
  state: ZefProgressState,
  key: string,
  id?: string | number
) => ({
  ...state,
  progress: state.progress.filter((item) => {
    if (id) { return item.key !== key || (item.key === key && item.id !== id); }
    return item.key !== key;
  })
});

const actionReducer = createReducer(
  initialState,
  on(
    zefAddProgress,
    (s, { key, id, progress, meta }): ZefProgressState => add(s, key, id, progress, meta)
  ),
  on(
    zefUpdateProgress,
    (s, { key, id, progress }): ZefProgressState => update(s, key, id, progress)
  ),
  on(
    zefRemoveProgress,
    (s, { key, id }): ZefProgressState => remove(s, key, id)
  ),
  on(zefResetState, () => initialState)
);

export function progressReducer(
  state = initialState,
  action: ZefAction
): ZefProgressState {

  state = actionReducer(state, action);

  if (action.zefProgress) {
    return add(
      state,
      action.type,
      action?.data?.id
        ? action.data.id
        : undefined,
      action?.meta
        ? action.meta
        : undefined
    );
  }

  if (action.originalAction && action.originalAction.zefProgress) {
    return remove(
      state,
      action.originalAction.type,
      action.originalAction.data
        ? action.originalAction.data.id
        : undefined
    );
  }

  return state;
}


