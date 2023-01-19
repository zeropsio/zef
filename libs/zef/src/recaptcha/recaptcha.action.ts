import { createAction, union, props } from '@ngrx/store';

export const setActive = createAction('[@zerops/zef/recaptcha] set-active');
export const setInactive = createAction(
  '[@zerops/zef/recaptcha] set-inactive',
  props<{ token: string }>()
);

const all = union({ setActive, setInactive });
export type RecaptchaActionUnion = typeof all;
