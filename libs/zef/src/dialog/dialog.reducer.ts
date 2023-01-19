import cloneDeep from 'lodash-es/cloneDeep';
import { createReducer, on } from '@ngrx/store';
import { arrayify, zefResetState } from '../core';
import { DialogState } from './dialog.model';
import {
  zefDialogOpen,
  zefDialogClose,
  zefDialogToggle,
  DialogActionUnion
} from './dialog.action';

export const initialState = new DialogState();

const actionReducer = createReducer(
  initialState,
  on(
    zefDialogOpen,
    (s, { key, meta }): DialogState => ({
      ...s,
      keys: {
        ...s.keys,
        [key]: { state: true, meta }
      }
    })
  ),
  on(
    zefDialogClose,
    (s, { key }): DialogState => {
      const keys = arrayify<string>(key);
      const bag = cloneDeep(s.keys);

      keys.forEach((k) => {
        const bagItm = bag[k];

        if (bagItm) {
          bag[k].state = false;
          bag[k].meta = undefined;
        }
      });

      return {
        ...s,
        keys: {
          ...bag
        }
      };

    }
  ),
  on(
    zefDialogToggle,
    (s, { key, meta }): DialogState => ({
      ...s,
      keys: {
        ...s.keys,
        [key]: s.keys[key]
          ?
            {
              state: !s.keys[key].state,
              meta
            }
          : {
            state: true,
            meta
          }
      }
    })
  ),
  on(zefResetState, () => initialState)
);

export function dialogReducer(
  state = initialState,
  action: DialogActionUnion
) {
  return actionReducer(state, action);
}
