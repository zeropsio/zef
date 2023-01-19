import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecaptchaState } from './recaptcha.model';
import { FEATURE_NAME } from './recaptcha.constant';

export const slice = createFeatureSelector<RecaptchaState>(FEATURE_NAME);

export const state = createSelector(slice, (s) => s.active);
