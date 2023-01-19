import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FEATURE_NAME } from './forms.constant';
import { FormsState } from './forms.model';

export const selectFormsState = createFeatureSelector<FormsState>(FEATURE_NAME);

export const selectFormState = (id: string) => createSelector(
  selectFormsState,
  (s) => s[id]
);
