import {
  Component,
  Input,
  ContentChild,
  ViewChild,
  TemplateRef,
  HostBinding
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatButton } from '@angular/material/button';
import { Store, select } from '@ngrx/store';
import { selectZefProgressesByType } from '../progress';
import {
  selectZefErrorsByType,
  zefRemoveError,
  ZefErrorTemplateService
} from '../errors';
import { SatPopoverAnchor } from '../popover';
import { BaseClass } from '../core';
import { Observable, timer, Subject } from 'rxjs';
import {
  switchMap,
  map,
  tap,
  delayWhen,
  withLatestFrom,
  filter,
  pairwise
} from 'rxjs/operators';
import { ObservableInput } from 'observable-input';
import isArray from 'lodash-es/isArray';

@Component({
  selector: 'zef-progress-error',
  templateUrl: './progress-error.container.html',
  styleUrls: [ './progress-error.container.scss' ]
})
export class ProgressErrorContainer extends BaseClass {
  // # Event Streams
  onPopoverClosed$ = new Subject<void>();

  // # Data
  // -- sync
  tpl: TemplateRef<any>;

  // -- angular
  @ObservableInput()
  @Input('key')
  key$!: any | Observable<string | string[]>;

  @Input()
  set full(v: string | boolean) {
    this._full = coerceBooleanProperty(v);
  }
  get full(): boolean {
    return this._full;
  }

  @Input()
  loading = false;

  @Input()
  disabled = false;

  @ContentChild(MatButton, { static: true })
  buttonRef: MatButton;

  @ViewChild(SatPopoverAnchor, { static: true })
  popoverAnchorRef: SatPopoverAnchor;

  @HostBinding('class.is-full')
  get classIsFull() {
    return this.full;
  }

  // -- async
  progressActive$ = this.key$.pipe(
    switchMap((keyOrKeys) => this._store.pipe(
      select(selectZefProgressesByType(keyOrKeys)),
    )),
    map((d) => !!d.length),
    delayWhen((v) => !v ? timer(200) : timer(0))
  );
  errorData$ = this.key$.pipe(
    switchMap((keyOrKeys) => this._store.pipe(
      select(selectZefErrorsByType(keyOrKeys)),
    ))
  );
  errorsActive$ = this.errorData$.pipe(
    map((d) => d.filter((i) => !!(i.errorType === 'pop'))),
    tap((errs) => {
      if (this.popoverAnchorRef) {
        if (errs && errs.length) {
          this.popoverAnchorRef.popover.open();
        } else {
          this.popoverAnchorRef.popover.close();
        }
      }
    }),
    pairwise(),
    map(([ a, b ]) => a.length ? a : b),
    delayWhen((d) => !d || !d.length? timer(100) : timer(0))
  );

  // # Action Streams
  private _popoverClosedAction$ = this.onPopoverClosed$.pipe(
    withLatestFrom(
      this.key$,
      this.errorData$
    ),
    filter(([ _, __, d ]) => !!d.length),
    map(([ _, key ]) => {
      const k = isArray(key) ? key[0] : key;
      return zefRemoveError(k as string);
    })
  );

  private _full: boolean;

  constructor(
    private _store: Store<any>,
    private _errorTemplates: ZefErrorTemplateService
  ) {
    super();

    this.tpl = this._errorTemplates.getTemplate('pop');

    this.dispatchActions$$(
      this._store,
      [ this._popoverClosedAction$ ]
    );
  }
}
