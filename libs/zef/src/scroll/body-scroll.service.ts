import {
  Inject,
  PLATFORM_ID,
  Injectable
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { WindowRef } from '../core';
import { Subject, Observable } from 'rxjs';
import animateScrollTo from 'animated-scroll-to';
import { NavigationEnd, Router } from '@angular/router';

type ReachStreams = 'reached-start' | 'reached-end' | 'left-start' | 'left-end';
interface AxisData<T> {
  x: T;
  y: T;
}

interface ScrollState {
  pct: number;
  px: number;
  dir: 'up' | 'down';
}

function getScrollCoordinate(el: any) {
  return {
    x: (el.pageXOffset || el.scrollLeft) || 0,
    y: (el.pageYOffset || el.scrollTop) || 0,
  };
}

@Injectable({ providedIn: 'root' })
export class BodyScrollService {

  isScrolling: boolean;

  reachedEnd = false;
  reachedStart = false;
  scrollPercent = 0;
  scrollPosition = {
    x: 0,
    y: 0
  };

  scrollState$: Observable<ScrollState>;
  reachEventStream$: Observable<any>;

  private _viewportSize = {
    width: 0,
    height: 0
  };
  private _scrollSize = {
    width: 0,
    height: 0
  };
  private _prevScrollPercent = 0;
  private _scrollIndicatorTimer: number;
  private _scrollPosition: AxisData<number> = {
    x: undefined,
    y: undefined
  };

  private _reachEventStream$ = new Subject<ReachStreams>();
  private _scrollStateStream$ = new Subject<ScrollState>();

  private _listener = () => {

    this._measureScrollPosition();
    this._measureScrollPercent();
    this._checkReaches();

    if (!this.isScrolling) {
      this.isScrolling = true;
    }

  }

  constructor(
    @Inject(DOCUMENT)
    private _document: Document,
    @Inject(PLATFORM_ID)
    // eslint-disable-next-line @typescript-eslint/ban-types
    private _platform: Object,
    private _windowRef: WindowRef,
    private _viewport: ViewportRuler,
    private _router: Router
  ) {

    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.refresh();
      }
    })

    this.scrollState$ = this._scrollStateStream$.asObservable();
    this.reachEventStream$ = this._reachEventStream$.asObservable();

    setTimeout(() => this.init());

    this._viewport.change().subscribe(() => {
      this._measureSizes();
      this._checkReaches();
      this._measureScrollPercent();
    });

    // if (isPlatformBrowser(this._platform)) {
    //   this._scrollIndicatorTimer = window.setInterval(() => {
    //     if (this.isScrolling) {
    //       this.isScrolling = false;
    //     }
    //   }, 400);
    // }

  }

  init() {
    this.setupScrollListener();
    this._measureSizes();
    this._measureScrollPosition();
    this._measureScrollPercent();
    this._checkReaches();

    setTimeout(() => {
      this.refresh();
    }, 100);

    setTimeout(() => {
      this.refresh();
    }, 200);

    setTimeout(() => {
      this.refresh();
    }, 300);
  }

  refresh() {
    this._measureSizes();
    this._measureScrollPosition();
    this._measureScrollPercent();
    this._checkReaches();
  }

  setupScrollListener() {
    const that = this;
    if (isPlatformBrowser(this._platform)) {
      // this._ngZone.runOutsideAngular(() => {
        this._windowRef.nativeWindow.addEventListener(
          'scroll',
          that._listener,
          { capture: true, passive: true }
        );
      // });
    }
  }

  jumpToTop() {
    this._document.body.scrollTop = 0; // For Safari
    this._document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  scrollTo(t: any, time: number, offset = 0) {
    animateScrollTo(t, {
      speed: time,
      verticalOffset: offset
    });
  }

  destroy() {

    if (isPlatformBrowser(this._platform)) {
      this._windowRef.nativeWindow.removeEventListener('scroll', this._listener);
    }

    if (this._scrollIndicatorTimer) {
      clearInterval(this._scrollIndicatorTimer);
    }

  }

  private _measureScrollPosition() {
    if (isPlatformBrowser(this._platform)) {
      this._scrollPosition = getScrollCoordinate(this._windowRef.nativeWindow);
    }
  }

  private _measureSizes() {
    this._viewportSize = this._viewport.getViewportSize();

    this._scrollSize.height = this._document.body.scrollHeight;
    this._scrollSize.width = this._document.body.scrollWidth;

  }

  private _measureScrollPercent() {
    this.scrollPosition = {
      x: this._scrollPosition.x,
      y: this._scrollPosition.y,
    };
    this.scrollPercent = this._scrollPosition.y / (this._scrollSize.height - this._viewportSize.height);

    if (this.scrollPercent > 1) { this.scrollPercent = 1; }
    if (this.scrollPercent < 0) { this.scrollPercent = 0; }

    this._scrollStateStream$.next({
      px: this._scrollPosition.y,
      pct: this.scrollPercent,
      dir: this.scrollPercent < this._prevScrollPercent
        ? 'up'
        : 'down'
    });

    this._prevScrollPercent = this.scrollPercent;
  }

  private _checkReaches() {

    if (this._scrollPosition.y < 10) {
      if (!this.reachedStart) {
        this.reachedStart = true;
        this._reachEventStream$.next('reached-start');
      }
    } else {
      if (this.reachedStart) {
        this.reachedStart = false;
        this._reachEventStream$.next('left-start');
      }
    }

    if (this._scrollPosition.y > ((this._scrollSize.height - this._viewportSize.height) - 10)) {
      if (this.reachedEnd === false) {
        this.reachedEnd = true;
        this._reachEventStream$.next('reached-end');
      }
    } else {
      if (this.reachedEnd) {
        this.reachedEnd = false;
        this._reachEventStream$.next('left-end');
      }
    }

  }

}
