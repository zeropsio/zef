import { createReducer, on } from '@ngrx/store';
import { NgrxRouterState } from './ngrx-router.model';
import { zefSetId, ZefNgrxRouterActionUnion, zefResetId } from './ngrx-router.action';
import { zefResetState } from '../core';

const initialState = new NgrxRouterState();

const actionReducer = createReducer(
  initialState,
  on(
    zefSetId,
    (s, { key, id }): NgrxRouterState => ({
      ...s,
      idMap: {
        [key]: id
      }
    })
  ),
  on(
    zefResetId,
    (s, { key }): NgrxRouterState => ({
      ...s,
      idMap: {
        [key]: undefined
      }
    })
  ),
  on(
    zefResetState,
    () => ({
    ...initialState,
    idMap: undefined
  }))
);

export function ngrxRouterStateReducer(
  state: NgrxRouterState,
  action: ZefNgrxRouterActionUnion
) {
  return actionReducer(state, action);
}
