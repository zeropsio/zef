import { Input, Output, EventEmitter, ViewChild, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { withLatestFrom, filter, map } from 'rxjs/operators';
import { ZefFormComponent } from './modules/form/form.component';
import { ZefForm } from './form.service';

// TODO: remove selector when angular 9 is final
// @Directive({ selector: '[zefZefFormBase]' })
@Directive()
// tslint:disable-next-line:directive-class-suffix
export class ZefFormBase<S> {
  @Input()
  state: S;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() submit = new EventEmitter<void | S>();

  @ViewChild(ZefFormComponent, { static: false })
  formRef: ZefFormComponent<S>;

  triggerSubmit() {
    if (this.formRef) {
      this.formRef.triggerSubmit();
    }  else {
      console.warn('Could not find formRef');
    }
  }
}

export const formValueOnValid = <T>(form: ZefForm<T>) => (source: Observable<any>) => source.pipe(
  withLatestFrom(form.value$, form.valid$),
  filter(([ _, __, v ]) => !!v),
  map(([ _, d ]) => d)
);
