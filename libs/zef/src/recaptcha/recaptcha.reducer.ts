import { RecaptchaState } from './recaptcha.model';
import { setActive, setInactive, RecaptchaActionUnion } from './recaptcha.action';
import { createReducer, on } from '@ngrx/store';
import { zefResetState } from '../core';

const initialState = new RecaptchaState();

const actionReducer = createReducer(
  initialState,
  on(
    setActive,
    (s): RecaptchaState => ({ ...s, active: true })
  ),
  on(
    setInactive,
    (s): RecaptchaState => ({ ...s, active: false })
  ),
  on(zefResetState, () => initialState)
);

export function recaptchaReducer(
  state = initialState,
  action: RecaptchaActionUnion
) {
  return actionReducer(state, action);
}
