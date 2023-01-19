import {
  Directive,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseClass, isOnDestroy } from '../../../core';
import { Subject} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { zefDialogOpen } from '../../dialog.action';

@Directive({
  selector: '[zefNgrxDialogOpen]',
})
export class NgrxDialogOpenDirective extends BaseClass implements OnInit {
  @Input()
  zefNgrxDialogOpen: string;

  @Input()
  zefNgrxDialogOpenMeta: any;

  private _onOpen$ = new Subject<void>();

  constructor(private _store: Store<any>) {
    super();
  }

  @HostListener('click')
  onClick() {
    this._onOpen$.next();
  }

  override ngOnInit() {
    this._onOpen$
      .pipe(
        map(() => zefDialogOpen({
          key: this.zefNgrxDialogOpen,
          meta: this.zefNgrxDialogOpenMeta
        })),
        takeUntil(this.lifecycle$.pipe(isOnDestroy()))
      )
      .subscribe(this._store);
  }
}
