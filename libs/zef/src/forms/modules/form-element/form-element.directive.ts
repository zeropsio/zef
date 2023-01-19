import {
  Directive,
  Optional,
  Inject,
  ElementRef,
  OnInit
} from '@angular/core';
import { NgrxFormControlDirective } from 'ngrx-forms';

// TODO: form state interfaces
@Directive({
  selector: '[zefFormElement], [matInput]'
})
export class ZefFormElementDirective implements OnInit {
  elRef: ElementRef;

  constructor(
    @Optional()
    @Inject(NgrxFormControlDirective)
    private _ngrxFormControlRef: NgrxFormControlDirective<any>,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.elRef = this._elementRef;
  }

  getState() {
    return this._ngrxFormControlRef
      ? this._ngrxFormControlRef.state
      : undefined;
  }
}
