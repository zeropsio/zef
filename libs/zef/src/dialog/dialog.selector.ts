import { createSelector, createFeatureSelector, } from '@ngrx/store';
import { DialogState } from './dialog.model';
import { FEATURE_NAME } from './dialog.constant';

export const selectZefDialogSlice = createFeatureSelector<DialogState>(FEATURE_NAME);

export const selectZefDialogState = (key: string) => createSelector(
  selectZefDialogSlice,
  (slice) => slice ? slice.keys[key] || { state: false } : { state: false }
);
