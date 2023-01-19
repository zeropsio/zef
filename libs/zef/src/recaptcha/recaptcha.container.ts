import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ZefReactiveComponentBase } from '../core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ReCaptcha2Component } from 'ngx-captcha';
import {
  map,
  delay,
  tap
} from 'rxjs/operators';
import { state } from './recaptcha.selector';
import { setInactive } from './recaptcha.action';

@Component({
  selector: 'zef-recaptcha',
  templateUrl: './recaptcha.container.html',
  styleUrls: [ './recaptcha.container.scss' ]
})
export class RecaptchaContainer extends ZefReactiveComponentBase {
  // # Event Streams
  onResolve$ = new Subject<string>();
  onLoaded$ = new BehaviorSubject(false);

  // # Forms
  form = new UntypedFormControl();

  // # Data
  // -- angular
  @Input()
  siteKey: string;

  @Input()
  lang: string;

  @Input()
  size: 'compact' | 'normal' = 'normal';

  @ViewChild(ReCaptcha2Component, { static: false })
  recaptchRef: ReCaptcha2Component;

  // -- async
  isActive$ = this._store.pipe(select(state));
  isActiveDelayed$ = this.isActive$.pipe(delay(10));
  isLoaded$ = this.isActiveDelayed$.pipe(delay(800));

  // # State resolver
  state = this.$connect({
    isActive: this.isActive$,
    isActiveDelayed: this.isActiveDelayed$,
    isLoaded: this.isLoaded$
  });

  // # Action Streams
  private _resolveAction$ = this.onResolve$.pipe(
    map((token) => setInactive({ token })),
    tap(() => this.recaptchRef.resetCaptcha())
  );

  constructor(
    private _store: Store<any>
  ) {
    super();

    this.$dispatchActions([ this._resolveAction$ ]);
  }

  handleExpire() {
    // console.warn('expire');
  }

}
