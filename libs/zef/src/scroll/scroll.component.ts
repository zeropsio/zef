// tslint:disable:no-bitwise
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import {
  CdkScrollable,
  ViewportRuler
} from '@angular/cdk/scrolling';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HashMap } from '../core';
import {
  Subscription,
  Observable,
  Subject
} from 'rxjs';
import animatedScrollTo from 'animated-scroll-to';
import throttle from 'lodash-es/throttle';
import { getSafeScrollbarWidth } from './scroll.utils';
import { ResizeObserver as ResizeObserverPolyfill  } from '@juggle/resize-observer';
import { ZefScheduler } from '../core';

type Axis = 'x' | 'y';
interface AxisData<T> {
  x: T;
  y: T;
}

@Component({
  selector: 'zef-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: [ './scroll.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZefScrollComponent extends ZefScheduler implements AfterViewInit, OnInit, OnDestroy {

  nativeScrollbarOffsetStyles: HashMap<any>;
  isScrolling = false;
  forceXVisible = false;
  forceYVisible = true;
  scrollPercent: number;
  xReachedEnd = false;
  xReachedStart = true;
  yReachedEnd = false;
  yReachedStart = true;
  overflowState: AxisData<boolean> = {
    x: undefined,
    y: undefined
  };

  @Input()
  height: number | string;

  @Input()
  maxHeight: number | string;

  @Input()
  scrollbarMinSize = 20;

  @Input()
  scrollbarMaxSize: number;

  @Input()
  set enableCdkScrollable(v: string | boolean) {
    this._enableCdkScrollable = coerceBooleanProperty(v);

    if (v) {
      this.cdkScrollableRef?.ngOnInit();
    }
  }
  get enableCdkScrollable(): boolean {
    return this._enableCdkScrollable;
  }

  @Input()
  enable = true;

  @Input()
  delay = false;

  @Input()
  set showScrollButtons(v: string | boolean) {
    this._showScrollButtons = coerceBooleanProperty(v);
  }
  get showScrollButtons(): boolean {
    return this._showScrollButtons;
  }

  @ViewChild(CdkScrollable)
  cdkScrollableRef: CdkScrollable;

  @ViewChild('contentRef')
  contentRef: ElementRef;

  @ViewChild('scrollRef', { static: false })
  scrollRef: ElementRef;

  @ViewChild('heightObserverRef')
  heightObserverRef: ElementRef;

  @ViewChild('trackYRef', { read: CdkDrag })
  cdkDragYRef: CdkDrag;

  @ViewChild('trackXRef', { read: CdkDrag })
  cdkDragXRef: CdkDrag;

  @ViewChild('trackYRef', { read: ElementRef })
  trackYRef: ElementRef;

  @ViewChild('trackXRef', { read: ElementRef })
  trackXRef: ElementRef;

  private _isScrolling$: Observable<boolean>;
  private _resizeObserver: ResizeObserverPolyfill;
  private _enableCdkScrollable: boolean;
  private _showScrollButtons = false;
  private _subscriptions: Subscription[] = [];
  private _nativeScrollbarWidth = getSafeScrollbarWidth();
  private _innerHeight: number;
  private _innerWidth: number;
  private _outerHeight: number;
  private _outerWidth: number;
  private _scrollIndicatorTimer: number;
  private _prevDragDistance: AxisData<number> = {
    x: 0,
    y: 0
  };
  private _scrollbarSize: AxisData<number> = {
    x: undefined,
    y: undefined
  };
  private _scrollbarPosition: AxisData<number> = {
    x: undefined,
    y: undefined
  };
  private _nativeScrollPosition: AxisData<number> = {
    x: undefined,
    y: undefined
  };

  private _scrollEventListener: EventListener;
  private _scrollStream$ = new Subject<number>();

  constructor(
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private _platform: Object,
    private _cdRef: ChangeDetectorRef
    // private _contentObserver: ContentObserver
  ) {
    super();
  }

  ngOnInit() {
    this._hideNativeScrollbar();
  }

  ngAfterViewInit() {
    if (this.enable) {

      if (this.enableCdkScrollable) {
        this.cdkScrollableRef?.ngOnInit();
      } else {
        this.cdkScrollableRef?.ngOnDestroy();
      }

      this._measureContainersSizes();
      this._measureScrollbarSize();
      this._measureNativeScrollPosition();
      this._measureScrollbarPositionFromNativeScroll();
      this._writeScrollbarSizes();
      this._writeScrollbarPosition();
      this._setupResize();
      this._setupObservers();
      this._setupScroll();
    }
  }

  ngOnDestroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    this.scrollRef.nativeElement.removeEventListener('scroll', this._scrollEventListener);
    this._subscriptions.forEach((s) => s.unsubscribe());
    if (this._scrollIndicatorTimer) {
      clearInterval(this._scrollIndicatorTimer);
    }
  }

  scrollToBottom(duration?: number) {
    animatedScrollTo(10000000, {
      elementToScroll: this.scrollRef.nativeElement,
      maxDuration: duration,
      minDuration: duration
    });
  }

  scrollToTop(duration?: number) {
    animatedScrollTo(0, {
      elementToScroll: this.scrollRef.nativeElement,
      maxDuration: duration,
      minDuration: duration
    });
  }

  scrollTo(el: Element, duration?: number) {
    const to = this.scrollRef.nativeElement.scrollTop + el.getBoundingClientRect().top;

    animatedScrollTo(to, {
      elementToScroll: this.scrollRef.nativeElement,
      maxDuration: duration,
      minDuration: duration
    });
  }

  private _setupScroll() {
    this._ngZone.runOutsideAngular(() => {
      this._scrollEventListener = this.scrollRef.nativeElement.addEventListener(
        'scroll',
        (_: Event) => {
          this._measureNativeScrollPosition();
          this._measureScrollbarPositionFromNativeScroll();
          this._writeScrollbarPosition();
          this._checkReaches();
        },
        { capture: true, passive: true }
      );
    });
  }

  private _setupResize() {
    this._ngZone.runOutsideAngular(() => {
      const resizeStream$ = this._viewportRuler.change(150);

      const resizeStreamSubscription = resizeStream$.subscribe(() => {
        this._measureContainersSizes();
        this._measureScrollbarSize();
        this._measureScrollbarPositionFromNativeScroll();
        this._measureNativeScrollPosition();
        this._writeScrollbarSizes();
        this._writeScrollbarPosition();
        this._checkReaches();
      });

      this._subscriptions.push(resizeStreamSubscription);
    });
  }


  private _setupObservers() {

    try {

      this._ngZone.runOutsideAngular(() => {

        const ResizeObserver: any = ((window as any)?.ResizeObserver) || ResizeObserverPolyfill;

        this._resizeObserver = new ResizeObserver(throttle(() => {
          this._measureContainersSizes();
          this._measureScrollbarSize();
          this._measureNativeScrollPosition();
          this._measureScrollbarPositionFromNativeScroll();
          this._writeScrollbarSizes();
          this._writeScrollbarPosition();
          this._checkReaches();
        }, 500));

        this._resizeObserver.observe(this.contentRef.nativeElement);
        this._resizeObserver.observe(this.scrollRef.nativeElement);

      });

    } catch (err) {
      console.warn('An error has been caught:', err);
    }

    // const elWindow = getElementWindow(this.contentRef.nativeElement);

    // let resizeObserverStarted = false;
    // const resizeObserver = (elWindow as any).ResizeObserver;

    // const resizeObserverInstance = new resizeObserver(() => {

    //   if (!resizeObserverStarted) { return; }

    //   this._measureContainersSizes();
    //   this._measureScrollbarSize();
    //   this._measureScrollbarPositionFromNativeScroll();
    //   this._writeScrollbarSizes();
    //   this._writeScrollbarPosition();
    //   this._checkReaches();

    // });

    // elWindow.requestAnimationFrame(() => {
    //   resizeObserverStarted = true;
    // });

    // resizeObserverInstance.observe(this.contentRef.nativeElement);
    // resizeObserverInstance.observe(this.cdkScrollableRef.getElementRef().nativeElement);

    // // only needed for horizontal changes, not needed for now
    // // triggers too many times

    // // this._contentObserver
    // //   .observe(this.contentRef.nativeElement)
    // //   .pipe(debounceTime(500))
    // //   .subscribe(() => {
    // //     this._measureContainersSizes();
    // //     this._measureNativeScrollPosition();
    // //     this._measureScrollbarPositionFromNativeScroll();
    // //   });

  }

  private _measureContainersSizes() {
    const scrollEl = this.scrollRef.nativeElement;
    const contentEl = this.contentRef.nativeElement;

    this._innerHeight = contentEl.scrollHeight;
    this._innerWidth = contentEl.scrollWidth;

    this._outerHeight = scrollEl.offsetHeight;
    this._outerWidth = scrollEl.offsetWidth;


    this.overflowState = {
      x: this._innerWidth > this._outerWidth,
      y: this._innerHeight > this._outerHeight
    };

  }

  private _measureScrollbarSize() {
    this._scrollbarSize = {
      x: this._getScrollbarSize('x'),
      y: this._getScrollbarSize('y')
    };
  }

  private _measureScrollbarPositionFromNativeScroll() {
    this._scrollbarPosition = {
      x: this._getScrollbarPositionFromNativeScroll('x'),
      y: this._getScrollbarPositionFromNativeScroll('y')
    };
  }

  // private _measureNativeScrollPositionFromScrollbar(axis: Axis) {

  //   const total = this._getOuterSize(axis) - this._scrollbarSize[axis];
  //   const scrollPercent = this._scrollbarPosition[axis] / total;
  //   const innerSize = this._getInnerSize(axis);
  //   const outerSize = this._getOuterSize(axis);

  //   this._nativeScrollPosition[axis] = (innerSize - outerSize) * scrollPercent;

  // }

  private _measureNativeScrollPosition() {
    const scrollEl = this.scrollRef.nativeElement;

    this._nativeScrollPosition = {
      y: scrollEl.scrollTop,
      x: scrollEl.scrollLeft
    };

    // // hack neede to get the actual final scroll position
    // setTimeout(() => this._checkReaches());

  }

  private _writeScrollbarPosition() {

    if (this._scrollbarSize.y) {
      this.trackYRef.nativeElement.style.transform = `translate3d(0, ${this._scrollbarPosition.y}px, 0)`;
    }

    if (this._scrollbarSize.x) {
      this.trackXRef.nativeElement.style.transform = `translate3d(${this._scrollbarPosition.x}px, 0, 0)`;
    }

  }

  private _writeScrollbarSizes() {

    if (this._scrollbarSize.y) {
      this.trackYRef.nativeElement.style.display = 'block';
      this.trackYRef.nativeElement.style.height = `${this._scrollbarSize.y}px`;
    } else {
      this.trackYRef.nativeElement.style.display = 'none';
    }

    if (this._scrollbarSize.x) {
      this.trackXRef.nativeElement.style.display = 'block';
      this.trackXRef.nativeElement.style.width = `${this._scrollbarSize.x}px`;
    } else {
      this.trackXRef.nativeElement.style.display = 'none';
    }

  }

  private _getScrollbarSize(axis: Axis) {

    if (!this.overflowState[axis]) { return 0; }

    const contentSize = this._getInnerSize(axis);
    const trackSize = this._getOuterSize(axis);

    const scrollbarRatio = trackSize / contentSize;
    let scrollbarSize: number;

    scrollbarSize = Math.max(
      ~~(scrollbarRatio * trackSize),
      this.scrollbarMinSize
    );

    if (this.scrollbarMaxSize) {
      scrollbarSize = Math.min(scrollbarSize, this.scrollbarMaxSize);
    }

    return scrollbarSize;

  }

  private _getScrollbarPositionFromNativeScroll(axis: Axis) {

    if (!this.overflowState[axis]) { return; }

    const contentSize = this._getInnerSize(axis);
    const trackSize = this._getOuterSize(axis);

    this.scrollPercent = this._nativeScrollPosition[axis] / (contentSize - trackSize);

    if (this.scrollPercent > 1) { this.scrollPercent = 1; }
    if (this.scrollPercent < 0) { this.scrollPercent = 0; }

    const r = ~~((trackSize - this._scrollbarSize[axis]) * this.scrollPercent);

    return r;

  }

  private _getInnerSize(axis: Axis) {
    return {
      x: this._innerWidth,
      y: this._innerHeight
    }[axis];
  }

  private _getOuterSize(axis: Axis) {
    return {
      x: this._outerWidth,
      y: this._outerHeight
    }[axis];
  }

  private _checkReaches() {

    if (this.overflowState.x) {

      if (this._scrollbarPosition.x === 0) {
        this._ngZone.run(() => {
          this.xReachedStart = true;
          this.renderScheduler.schedule();
        });
      } else {
        if (this.xReachedStart) {
          this._ngZone.run(() => {
            this.xReachedStart = false;
            this.renderScheduler.schedule();
          });
        }
      }

      if (this._nativeScrollPosition.x === (this._getInnerSize('x') - this._getOuterSize('x'))) {
        this._ngZone.run(() => {
          this.xReachedEnd = true;
          this.renderScheduler.schedule();
        });
      } else {
        if (this.xReachedEnd) {
          this._ngZone.run(() => {
            this.xReachedEnd = false;
            this.renderScheduler.schedule();
          });
        }
      }

    }

    if (this.overflowState.y) {

      if (this._scrollbarPosition.y <= 0) {
        if (!this.yReachedStart) {
          this._ngZone.run(() => {
            this.yReachedStart = true;
            this.renderScheduler.schedule();
          });
        }
      } else {
        if (this.yReachedStart) {
          this._ngZone.run(() => {
            this.yReachedStart = false;
            this.renderScheduler.schedule();
          });
        }
      }

      if (this._nativeScrollPosition.y > ((this._getInnerSize('y') - this._getOuterSize('y'))) - 10) {
        if (this.yReachedEnd === false) {
          this._ngZone.run(() => {
            this.yReachedEnd = true;
            this.renderScheduler.schedule();
          });
        }
      } else {
        if (this.yReachedEnd) {
          this._ngZone.run(() => {
            this.yReachedEnd = false;
            this.renderScheduler.schedule();
          });
        }
      }

    } else {
      if (!this.yReachedEnd) {
        this._ngZone.run(() => {
          this.yReachedEnd = true;
          this.renderScheduler.schedule();
        });
      }
    }

  }

  // private _reflectDragScrollbarPosition(
  //   distance: AxisData<number>,
  //   axis: Axis
  // ) {
  //   this._scrollbarPosition[axis] = this._scrollbarPosition[axis] + (distance[axis] - this._prevDragDistance[axis]);
  //   this._prevDragDistance[axis] = distance[axis];

  //   this._checkReaches();
  // }

  private _hideNativeScrollbar() {
    this.nativeScrollbarOffsetStyles = {
      'marginRight.px': -(this._nativeScrollbarWidth),
      'marginBottom.px': -(this._nativeScrollbarWidth)
    };
  }

}
