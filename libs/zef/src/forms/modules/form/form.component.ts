import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
  ContentChildren,
  QueryList
} from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { ActionsSubject } from '@ngrx/store';
import {
  FormGroupState,
  MarkAsSubmittedAction,
  FocusAction
} from 'ngrx-forms';
import { ZefFormElementDirective } from '../form-element';
import animateScrollTo from 'animated-scroll-to';

@Component({
  selector: 'zef-form',
  templateUrl: './form.component.html',
  styleUrls: [ './form.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZefFormComponent<FS extends { [key: string]: any; }> {
  @Input()
  state: FormGroupState<FS>;

  @Input()
  autoScroll = true;

  @Input()
  scrollOffset = -50;

  @Input()
  formGroupElementRef: QueryList<ZefFormElementDirective>;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() submit = new EventEmitter<Event>();

  @Output()
  submitError = new EventEmitter<{
    offset: number;
    element: HTMLElement;
    ngrxFormStateId: string;
  }>();

  @ViewChild('formElRef', { read: ElementRef, static: true })
  formElRef: ElementRef;

  @ContentChildren(ZefFormElementDirective, { descendants: true })
  formElementsRefs: QueryList<ZefFormElementDirective>;

  constructor(
    private _actions: ActionsSubject,
    private _scroll: ScrollDispatcher,
    public elementRef: ElementRef
  ) { }

  triggerSubmit() {
    const e = new Event('submit', {
      bubbles: true,
      cancelable: true
    });

    this.formElRef.nativeElement.dispatchEvent(e);
  }

  _onSubmit(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.submit.emit(e);

    if ('activeElement' in document) {
      if (((document.activeElement as any).nodeNAME as string) !== 'button') {
        (document.activeElement as any).blur();
      }
    }

    if (this.state && this.state.isUnsubmitted) {
      this._markControlAsSubmitted(this.state.id);
    }

    const err = this._getFirstErrorInput();

    if (err) {
      this.submitError.emit(err);

      if (this.autoScroll) {
        this._scrollToError(
          err.offset,
          err.ngrxFormStateId
        );
      }
    }
  }

  private _getFirstErrorInput() {
    const feRefs = this._getActualFormElementRefs();

    if (feRefs && !!feRefs.length) {
      const firstInvalidEl = feRefs.find((itm) => itm.getState() && itm.getState().isInvalid);

      if (firstInvalidEl) {
        const nativeEl = firstInvalidEl.elRef.nativeElement;

        return {
          offset: nativeEl.getBoundingClientRect().top,
          element: nativeEl,
          ngrxFormStateId: firstInvalidEl.getState().id
        };
      }
    }
  }

  private _scrollToError(offset: number, id: string) {

    const scrollParent = this._scroll.getAncestorScrollContainers(this.elementRef)[0];

    let scrollEl: HTMLElement | Window;
    let scrollElPos: number;
    if (scrollParent) {
      scrollEl = scrollParent.getElementRef().nativeElement;
      scrollElPos = scrollEl.scrollTop;
    } else {
      scrollEl = window;
      scrollElPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    animateScrollTo(
      scrollElPos + offset - (window.innerHeight / 2),
      {
        elementToScroll: scrollEl,
        maxDuration: 400
      }
    ).then(() => {
      setTimeout(() => {
        this._focusControlId(id);
      }, 50);
    });

  }

  private _focusControlId(id: string) {
    this._actions.next(new FocusAction(id));
  }

  private _markControlAsSubmitted(_: string) {
    this._actions.next(new MarkAsSubmittedAction(this.state.id));
  }

  private _getActualFormElementRefs() {
    if (this.formGroupElementRef) {
      return this.formGroupElementRef;
    }

    return this.formElementsRefs;
  }
}
