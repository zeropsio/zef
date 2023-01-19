import {
  FormGroupState,
  KeyValue,
  ProjectFn2,
  FormState
} from 'ngrx-forms';

export class FormsState {
}

export type StateUpdateFnsNested<TValue extends KeyValue> = {
  [key in keyof TValue]?: TValue[key] extends any
    ? ProjectFn2<FormState<TValue[key]>, FormGroupState<TValue>>
    // eslint-disable-next-line @typescript-eslint/ban-types
    : TValue[key][any] extends () => Object
      ? { [keyInner in keyof TValue[key]]?: ProjectFn2<FormState<TValue[key][keyInner]>, FormGroupState<TValue[key]>> }
      : (s: FormGroupState<TValue>) => {
        [keyInner in keyof TValue[key]]?: ProjectFn2<FormState<TValue[key][keyInner]>, FormGroupState<TValue[key]>>
      };
};
