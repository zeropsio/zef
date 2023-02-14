import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  UnfocusAction,
  FocusAction,
  ResetAction,
  SetValueAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  EnableAction,
  DisableAction,
  MarkAsTouchedAction,
  MarkAsUntouchedAction,
  MarkAsSubmittedAction,
  MarkAsUnsubmittedAction,
  FormGroupState,
  AddArrayControlAction,
  RemoveArrayControlAction
} from 'ngrx-forms';
import get from 'lodash-es/get';
import { ZefFormsManagerService } from './forms-manager.service';
import { addForm } from './forms.action';
import { selectFormState } from './forms.selector';
import { StateUpdateFnsNested } from './forms.model';
import { inject } from '@angular/core';

/*
# Example

```
export interface FooValue {
  bar: string;
}

export interface MehValue {
  asd: string;
}

export interface TestFormValue {
  foo: FooValue;
  baz: string;
  meh: MehValue;
}

@Injectable({ providedIn: 'root' })
export class TestForm extends ZefForm<TestFormValue> {
  constructor(
    public store: Store<AppState>,
    public formsManager: ZefFormsManagerService
  ) {
    super(
      store,
      formsManager,
      'test',
      {
        foo: {
          bar: ''
        },
        baz: '',
        meh: {
          asd: ''
        }
      },
      {
        foo: (rs) => {
          return {
            bar: (s, ps) => {
              if (rs.controls.meh.value.asd === 'foo') {
                return disable(s);
              } else {
                return enable(s);
              }
            }
          };
        },
        meh: {
          asd: validate(required)
        },
        baz: validate(required)
      }
    );

  }
}
```
*/
export class ZefForm<V> {
  // # // Deps
  store = inject(Store);
  formsManager = inject(ZefFormsManagerService);

  state$: Observable<FormGroupState<V>>;
  value$: Observable<V>;
  valid$: Observable<boolean>;
  pristine$: Observable<boolean>;
  dirty$: Observable<boolean>;
  touched$: Observable<boolean>;
  submitted$: Observable<boolean>;

  markDirty = (id?: string) => new MarkAsDirtyAction(this._getId(id));
  markPristine = (id?: string) => new MarkAsPristineAction(this._getId(id));
  enable = (id?: string) => new EnableAction(this._getId(id));
  disable = (id?: string) => new DisableAction(this._getId(id));
  markTouched = (id?: string) => new MarkAsTouchedAction(this._getId(id));
  markUntouched = (id?: string) => new MarkAsUntouchedAction(this._getId(id));
  markSubmitted = (id?: string) => new MarkAsSubmittedAction(this._getId(id));
  markUnsubmitted = (id?: string) => new MarkAsUnsubmittedAction(this._getId(id));
  addArrayControl = (id: string, value: any, index?: number) => new AddArrayControlAction(this._getId(id), value, index);
  removeArrayControl = (id: string, index: number) => new RemoveArrayControlAction(this._getId(id), index);
  blur = (id: string) => new UnfocusAction(this._getId(id));
  focus = (id: string) => new FocusAction(this._getId(id));
  reset = (id?: string) => new ResetAction(this._getId(id));
  setValue = (id?: string | Partial<V> | any, value?: Partial<V> | any) => new SetValueAction(
    this._getId(id && value ? (id as string) : undefined),
    (id && !value) ? (id as V) : value
  )
  setDefaultValues = (id?: string) => new SetValueAction(
    this._getId(id),
    id ? get(this.defaultValues, id) : this.defaultValues
  )

  constructor(
    public id: string,
    public defaultValues: V,
    public updateFns: StateUpdateFnsNested<V>
  ) {
    this.formsManager.add({ id, defaultValues, updateFns });
    this.store.dispatch(addForm({ id, defaultValues }));

    this.state$ = this.store.pipe(
      select(selectFormState(this.id))
    );
    this.value$ = this.state$.pipe(map((s) => (s as any)?.value));
    this.valid$ = this.state$.pipe(map((s) => (s as any)?.isValid));
    this.pristine$ = this.state$.pipe(map((s) => (s as any)?.isPristine));
    this.dirty$ = this.state$.pipe(map((s) => (s as any)?.isDirty));
    this.touched$ = this.state$.pipe(map((s) => (s as any)?.isTouched));
    this.submitted$ = this.state$.pipe(map((s) => (s as any)?.isSubmitted));
  }

  markDirtyDispatch(id?: string) {
    this.store.dispatch(this.markDirty(id));
  }

  markPristineDispatch(id?: string) {
    this.store.dispatch(this.markPristine(id));
  }

  enableDispatch(id?: string) {
    this.store.dispatch(this.enable(id));
  }

  disableDispatch(id?: string) {
    this.store.dispatch(this.disable(id));
  }

  markTouchedDispatch(id?: string) {
    this.store.dispatch(this.markTouched(id));
  }

  markUntouchedDispatch(id?: string) {
    this.store.dispatch(this.markUntouched(id));
  }

  markSubmittedDispatch(id?: string) {
    this.store.dispatch(this.markSubmitted(id));
  }

  markUnsubmittedDispatch(id?: string) {
    this.store.dispatch(this.markUnsubmitted(id));
  }

  focusDispatch(id?: string) {
    this.store.dispatch(this.focus(id));
  }

  blurDispatch(id?: string) {
    this.store.dispatch(this.blur(id));
  }

  resetDispatch(id?: string) {
    this.store.dispatch(this.reset(id));
  }

  setDefaultValuesDispatch(id?: string) {
    this.store.dispatch(this.setDefaultValues(id));
  }

  setValueDispatch(id?: string, value?: V) {
    this.store.dispatch(this.setValue(id, value));
  }

  addArrayControlDispatch(id: string, value: any, index?: number) {
    this.store.dispatch(this.addArrayControl(id, value, index));
  }

  reremoveArrayControlDispatch(id: string, index: number) {
    this.store.dispatch(this.removeArrayControl(id, index));
  }

  getId(path?: string) {
    return this._getId(path);
  }

  private _getId(path?: string) {
    return path
      ? `${this.id}.${path}`
      : this.id;
  }
}
