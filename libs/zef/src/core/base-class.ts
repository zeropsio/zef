import { OnInit, OnDestroy, Directive } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Subject, merge, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

export const isOnInit = () => filter((l) => l === 'OnInit');
export const isOnDestroy = () => filter((l) => l === 'OnDestroy');

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class BaseClass implements OnInit, OnDestroy {
  lifecycle$ = new Subject<'OnInit' | 'OnDestroy'>();

  ngOnInit() {
    this.lifecycle$.next('OnInit');
  }

  ngOnDestroy() {
    this.lifecycle$.next('OnDestroy');
    this.lifecycle$.complete();
  }

  dispatchActions$$(store: Store<any>, actions: Observable<Action>[]) {
    merge(...actions)
      .pipe(takeUntil(this.lifecycle$.pipe(isOnDestroy())))
      .subscribe(store);
  }
}
