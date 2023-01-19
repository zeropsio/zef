import {
  Directive,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseClass, isOnDestroy } from '../../../core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { zefDialogClose } from '../../dialog.action';

@Directive({
  selector: '[zefNgrxDialogClose]',
})
export class NgrxDialogCloseDirective extends BaseClass implements OnInit {
  @Input()
  zefNgrxDialogClose: string;

  private _onClose$ = new Subject<void>();

  constructor(private _store: Store<any>) {
    super();
  }

  @HostListener('click')
  onClick() {
    this._onClose$.next();
  }

  override ngOnInit() {
    this._onClose$
      .pipe(
        map(() => zefDialogClose({ key: this.zefNgrxDialogClose })),
        takeUntil(this.lifecycle$.pipe(isOnDestroy()))
      )
      .subscribe(this._store);
  }
}
