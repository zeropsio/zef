/* eslint-disable */
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  OnInit,
  Optional,
  Output,
  Directive,
  ViewContainerRef,
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { transformPopover } from './popover.animations';
import {
  getUnanchoredPopoverError,
  getInvalidHorizontalAlignError,
  getInvalidVerticalAlignError,
  getInvalidScrollStrategyError,
  getInvalidPopoverAnchorError,
  getInvalidSatPopoverAnchorError,
  getInvalidPopoverError,
} from './popover.errors';
import {
  SatPopoverScrollStrategy,
  SatPopoverHorizontalAlign,
  SatPopoverVerticalAlign,
  VALID_SCROLL,
  VALID_HORIZ_ALIGN,
  VALID_VERT_ALIGN,
  SatPopoverOpenOptions,
} from './types';
import { SatPopoverAnchoringService } from './popover-anchoring.service';

// See http://cubic-bezier.com/#.25,.8,.25,1 for reference.
const DEFAULT_TRANSITION  = '200ms cubic-bezier(0.4, 0.0, 0.2, 1)';

@Directive({
  selector: '[satPopoverAnchor]',
  exportAs: 'satPopoverAnchor',
})
export class SatPopoverAnchor {
  @Input('satPopoverAnchor')
  get popover() {
    return this._popover;
  }
  set popover(val: SatPopover) {
    if (val instanceof SatPopover) {
      val.anchor = this;
    }
    // when a directive is added with no arguments,
    // angular assigns `''` as the argument
    else if (val !== '') {
      throw getInvalidPopoverError();
    }
  }

  /** @internal */
  _popover: SatPopover;

  constructor(
    public elementRef: ElementRef,
    public viewContainerRef: ViewContainerRef,
  ) {}

  ngAfterViewInit() {
    if (!this.popover) {
      throw getInvalidSatPopoverAnchorError();
    }
  }
}

@Component({
  selector: 'sat-popover',
  encapsulation: ViewEncapsulation.None,
  animations: [transformPopover],
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  providers: [SatPopoverAnchoringService],
})
export class SatPopover implements OnInit {

  /** Anchor element. */
  @Input()
  get anchor() { return this._anchor; }
  set anchor(val: SatPopoverAnchor | ElementRef<HTMLElement> | HTMLElement) {
    if (val instanceof SatPopoverAnchor) {
      val._popover = this;
      this._anchoringService.anchor(this, val.viewContainerRef, val.elementRef);
      this._anchor = val;
    }
    else if (val instanceof ElementRef || val instanceof HTMLElement) {
      this._anchoringService.anchor(this, this._viewContainerRef, val);
      this._anchor = val;
    }
    else if (val) {
      throw getInvalidPopoverAnchorError();
    }
  }
  private _anchor: SatPopoverAnchor | ElementRef<HTMLElement> | HTMLElement;

  /** Alignment of the popover on the horizontal axis. */
  @Input()
  get horizontalAlign() { return this._horizontalAlign; }
  set horizontalAlign(val: SatPopoverHorizontalAlign) {
    this._validateHorizontalAlign(val);
    if (this._horizontalAlign !== val) {
      this._horizontalAlign = val;
      this._anchoringService.repositionPopover();
    }
  }
  private _horizontalAlign: SatPopoverHorizontalAlign = 'center';

  /** Alignment of the popover on the x axis. Alias for `horizontalAlign`. */
  @Input()
  get xAlign() { return this.horizontalAlign; }
  set xAlign(val: SatPopoverHorizontalAlign) { this.horizontalAlign = val; }

  /** Alignment of the popover on the vertical axis. */
  @Input()
  get verticalAlign() { return this._verticalAlign; }
  set verticalAlign(val: SatPopoverVerticalAlign) {
    this._validateVerticalAlign(val);
    if (this._verticalAlign !== val) {
      this._verticalAlign = val;
      this._anchoringService.repositionPopover();
    }
  }
  private _verticalAlign: SatPopoverVerticalAlign = 'center';

  /** Alignment of the popover on the y axis. Alias for `verticalAlign`. */
  @Input()
  get yAlign() { return this.verticalAlign; }
  set yAlign(val: SatPopoverVerticalAlign) { this.verticalAlign = val; }

  /** Whether the popover always opens with the specified alignment. */
  @Input()
  get forceAlignment(): boolean { return this._forceAlignment; }
  set forceAlignment(val: string | boolean) {
    const coercedVal = coerceBooleanProperty(val);
    if (this._forceAlignment !== coercedVal) {
      this._forceAlignment = coercedVal;
      this._anchoringService.repositionPopover();
    }
  }
  private _forceAlignment = false;

  /**
   * Whether the popover's alignment is locked after opening. This prevents the popover
   * from changing its alignment when scrolling or changing the size of the viewport.
   */
  @Input()
  get lockAlignment(): boolean { return this._lockAlignment; }
  set lockAlignment(val: string | boolean) {
    const coercedVal = coerceBooleanProperty(val);
    if (this._lockAlignment !== coercedVal) {
      this._lockAlignment = coerceBooleanProperty(val);
      this._anchoringService.repositionPopover();
    }
  }
  private _lockAlignment = false;

  /** Whether the first focus enabled element should be focused on open. */
  @Input()
  get autoFocus(): boolean { return this._autoFocus && this._autoFocusOverride; }
  set autoFocus(val: string | boolean) {
    this._autoFocus = coerceBooleanProperty(val);
  }
  private _autoFocus = true;
  _autoFocusOverride = true;

 /** Whether the popover should return focus to the previously focused element after closing. */
 @Input()
  get restoreFocus(): boolean { return this._restoreFocus && this._restoreFocusOverride; }
  set restoreFocus(val: string | boolean) {
    this._restoreFocus = coerceBooleanProperty(val);
  }
  private _restoreFocus = false;
  _restoreFocusOverride = false;

  /** How the popover should handle scrolling. */
  @Input()
  get scrollStrategy() { return this._scrollStrategy; }
  set scrollStrategy(val: SatPopoverScrollStrategy) {
    this._validateScrollStrategy(val);
    if (this._scrollStrategy !== val) {
      this._scrollStrategy = val;
      this._anchoringService.updatePopoverConfig();
    }
  }
  private _scrollStrategy: SatPopoverScrollStrategy = 'reposition';

  /** Whether the popover should have a backdrop (includes closing on click). */
  @Input()
  get hasBackdrop(): boolean { return this._hasBackdrop; }
  set hasBackdrop(val: string | boolean) {
    this._hasBackdrop = coerceBooleanProperty(val);
  }
  private _hasBackdrop = false;

  /** Whether the popover should close when the user clicks the backdrop or presses ESC. */
  @Input()
  get interactiveClose(): boolean { return this._interactiveClose; }
  set interactiveClose(val: string | boolean) {
    this._interactiveClose = coerceBooleanProperty(val);
  }
  private _interactiveClose = true;

  /** Custom transition to use while opening. */
  @Input()
  get openTransition() { return this._openTransition; }
  set openTransition(val: string) {
    if (val) {
      this._openTransition = val;
    }
  }
  private _openTransition = DEFAULT_TRANSITION;

  /** Custom transition to use while closing. */
  @Input()
  get closeTransition() { return this._closeTransition; }
  set closeTransition(val: string) {
    if (val) {
      this._closeTransition = val;
    }
  }
  private _closeTransition = DEFAULT_TRANSITION;

  /** Optional backdrop class. */
  @Input() backdropClass = '';

  @Input() hasArrow = false;

  /** Emits when the popover is opened. */
  @Output() opened = new EventEmitter<void>();

  /** Emits when the popover is closed. */
  @Output() closed = new EventEmitter<any>();

  /** Emits when the popover has finished opening. */
  @Output() afterOpen = new EventEmitter<void>();

  /** Emits when the popover has finished closing. */
  @Output() afterClose = new EventEmitter<void>();

  /** Emits when the backdrop is clicked. */
  @Output() backdropClicked = new EventEmitter<void>();

  /** Emits when a keydown event is targeted to this popover's overlay. */
  @Output() overlayKeydown = new EventEmitter<KeyboardEvent>();

  /** Emits when user enters content with mouse. */
  @Output() contentMouseEnter = new EventEmitter<MouseEvent>();

  /** Emits when user leaves content with mouse. */
  @Output() contentMouseLeave = new EventEmitter<MouseEvent>();

  /** Reference to template so it can be placed within a portal. */
  @ViewChild(TemplateRef, { static: true }) _templateRef: TemplateRef<any>;

  /** Classes to be added to the popover for setting the correct transform origin. */
  _classList: any = {};

  /** Whether the popover is presently open. */
  _open = false;

  /** @internal */
  _anchoringService: SatPopoverAnchoringService;

  /** Reference to the element to build a focus trap around. */
  @ViewChild('focusTrapElement', { static: true })
  private _focusTrapElement: ElementRef;

  /** Reference to the element that was focused before opening. */
  private _previouslyFocusedElement: HTMLElement;

  /** Reference to a focus trap around the popover. */
  private _focusTrap: FocusTrap;

  constructor(
    private _focusTrapFactory: FocusTrapFactory,
    _anchoringService: SatPopoverAnchoringService,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    // `@internal` stripping doesn't seem to work if the property is
    // declared inside the constructor
    this._anchoringService = _anchoringService;
  }

  ngOnInit() {
    this._setAlignmentClasses();
  }

  /** Open this popover. */
  open(options: SatPopoverOpenOptions = {}): void {
    if (this._anchor) {
      this._anchoringService.openPopover(options);
      return;
    }

    throw getUnanchoredPopoverError();
  }

  /** Close this popover. */
  close(value?: any): void {
    this._anchoringService.closePopover(value);
  }

  /** Toggle this popover open or closed. */
  toggle(): void {
    this._anchoringService.togglePopover();
  }

  /** Realign the popover to the anchor. */
  realign(): void {
    this._anchoringService.realignPopoverToAnchor();
  }

  /** Gets whether the popover is presently open. */
  isOpen(): boolean {
    return this._open;
  }

  /** Allows programmatically setting a custom anchor. */
  setCustomAnchor(
    viewContainer: ViewContainerRef,
    el: ElementRef<HTMLElement> | HTMLElement
  ): void {
    this._anchor = el;
    this._anchoringService.anchor(this, viewContainer, el);
  }

  /** Gets an animation config with customized (or default) transition values. */
  _getAnimation(): { value: any, params: any } {
    return {
      value: 'visible',
      params: { openTransition: this.openTransition, closeTransition: this.closeTransition }
    };
  }

  /** Callback for when the popover is finished animating in or out. */
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'visible') {
      this._trapFocus();
      this.afterOpen.emit();
    } else if (event.toState === 'void') {
      this._restoreFocusAndDestroyTrap();
      this.afterClose.emit();
    }
  }

  /** Apply alignment classes based on alignment inputs. */
  _setAlignmentClasses(horizAlign = this.horizontalAlign, vertAlign = this.verticalAlign) {
    this._classList['sat-popover-before'] = horizAlign === 'before' || horizAlign === 'end';
    this._classList['sat-popover-after']  = horizAlign === 'after' || horizAlign === 'start';

    this._classList['sat-popover-above'] = vertAlign === 'above' || vertAlign === 'end';
    this._classList['sat-popover-below'] = vertAlign === 'below' || vertAlign === 'start';

    this._classList['sat-popover-center'] = horizAlign === 'center' || vertAlign === 'center';
  }

  /** Move the focus inside the focus trap and remember where to return later. */
  private _trapFocus(): void {
    this._savePreviouslyFocusedElement();

    // There won't be a focus trap element if the close animation starts before open finishes
    if (!this._focusTrapElement) {
      return;
    }

    if (!this._focusTrap && this._focusTrapElement) {
      this._focusTrap = this._focusTrapFactory.create(this._focusTrapElement.nativeElement);
    }

    if (this.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    }
  }

  /** Restore focus to the element focused before the popover opened. Also destroy trap. */
  private _restoreFocusAndDestroyTrap(): void {
    const toFocus = this._previouslyFocusedElement;

    // Must check active element is focus enabled for IE sake
    if (toFocus && 'focus' in toFocus && this.restoreFocus) {
      this._previouslyFocusedElement.focus();
    }

    this._previouslyFocusedElement = null;

    if (this._focusTrap) {
      this._focusTrap.destroy();
      this._focusTrap = undefined;
    }
  }

  /** Save a reference to the element focused before the popover was opened. */
  private _savePreviouslyFocusedElement(): void {
    if (this._document) {
      this._previouslyFocusedElement = this._document.activeElement as HTMLElement;
    }
  }

  /** Throws an error if the alignment is not a valid horizontalAlign. */
  private _validateHorizontalAlign(pos: SatPopoverHorizontalAlign): void {
    if (VALID_HORIZ_ALIGN.indexOf(pos) === -1) {
      throw getInvalidHorizontalAlignError(pos);
    }
  }

  /** Throws an error if the alignment is not a valid verticalAlign. */
  private _validateVerticalAlign(pos: SatPopoverVerticalAlign): void {
    if (VALID_VERT_ALIGN.indexOf(pos) === -1) {
      throw getInvalidVerticalAlignError(pos);
    }
  }

  /** Throws an error if the scroll strategy is not a valid strategy. */
  private _validateScrollStrategy(strategy: SatPopoverScrollStrategy): void {
    if (VALID_SCROLL.indexOf(strategy) === -1) {
      throw getInvalidScrollStrategyError(strategy);
    }
  }
}
