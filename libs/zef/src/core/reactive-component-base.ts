import { Directive } from '@angular/core';
import { Observable, ReplaySubject, from, concat } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';

import { ZefScheduler } from './zef-scheduler';

type ObservableDictionary<T> = {
  [P in keyof T]: Observable<T[P]>;
};

const OnInitSubject = Symbol('OnInitSubject');
const OnDestroySubject = Symbol('OnDestroySubject');

@Directive()
export abstract class ZefReactiveComponentBase extends ZefScheduler implements OnInit, OnDestroy {

  private [OnInitSubject] = new ReplaySubject<true>(1);
  private [OnDestroySubject] = new ReplaySubject<true>(1);

  public get onInit$() {
    return this[OnInitSubject].asObservable();
  }

  public get onDestroy$() {
    return this[OnDestroySubject].asObservable();
  }

  constructor() {
    super();
  }

  $connect<T>(sources: ObservableDictionary<T>, log = false): T {
    const sink = {} as T;
    const sourceKeys = Object.keys(sources) as (keyof T)[];
    const updateSink$ = from(sourceKeys).pipe(
      mergeMap((sourceKey) => {
        const source$ = sources[sourceKey];

        return source$.pipe(
          tap((sinkValue: any) => {
            sink[sourceKey] = sinkValue;

            if (log) {
              console.log(JSON.stringify(sink));
            }

          })
        );
      })
    );

    concat(this.onInit$, updateSink$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.renderScheduler.schedule());

    return sink;
  }

  ngOnInit() {
    this[OnInitSubject].next(true);
    this[OnInitSubject].complete();
  }

  ngOnDestroy() {
    this[OnDestroySubject].next(true);
    this[OnDestroySubject].complete();
  }

  trackByIndex(index: number) {
    return index;
  }

}
