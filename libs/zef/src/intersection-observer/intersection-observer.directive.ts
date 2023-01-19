import { Directive, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fromIntersectionObserver, IntersectionStatus } from './intersection-observer.utils';

@Directive({
  selector: '[zefIntersectionObserver]'
})
export class ZefIntersectionObserverDirective implements OnInit, OnDestroy {
  @Input()
  intersectionDebounce = 0;

  @Input()
  intersectionRootMargin = '0px';

  @Input()
  intersectionRoot: HTMLElement;

  @Input()
  intersectionThreshold: number | number[];

  @Output()
  visibilityChange = new EventEmitter<IntersectionStatus>();

  private _destroy$ = new Subject<void>();

  constructor(
    private _element: ElementRef,
    @Inject(PLATFORM_ID)
    // eslint-disable-next-line @typescript-eslint/ban-types
    private _platform: Object
  ) {}

  ngOnInit() {
    const element = this._element.nativeElement;
    const config = {
      root: this.intersectionRoot,
      rootMargin: this.intersectionRootMargin,
      threshold: this.intersectionThreshold
    };

    if (!!isPlatformBrowser(this._platform)) {
      fromIntersectionObserver(
        element,
        config,
        this.intersectionDebounce
      ).pipe(
        takeUntil(this._destroy$)
      ).subscribe((status) => {
        this.visibilityChange.emit(status);
      });
    }

  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
