import {
  Component,
  ContentChild,
  Input,
  HostBinding
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ZefFormHintsDirective } from '../form-hints/form-hints.directive';
import { ZefFormLabelDirective } from '../form-label/form-label.directive';

type Appearances
  = 'regular'
  | 'radio'
  | 'button-toggle'
  | 'slide-toggle'
  | 'checkbox';

@Component({
  selector: 'zef-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: [ './form-field.component.scss' ]
})
export class ZefFormFieldComponent {
  @Input()
  appearance: Appearances = 'regular';

  @Input()
  set last(v: string | boolean) {
    this._last = coerceBooleanProperty(v);
  }
  get last(): boolean {
    return this._last;
  }

  @Input()
  set vertical(v: string | boolean) {
    this._vertical = coerceBooleanProperty(v);
  }
  get vertical(): boolean {
    return this._vertical;
  }

  @ContentChild(ZefFormLabelDirective, { static: true })
  label: ZefFormLabelDirective;

  @ContentChild(ZefFormHintsDirective, { static: true })
  hints: ZefFormHintsDirective;

  @HostBinding('class.is-last')
  get classIsLast() {
    return this.last;
  }

  @HostBinding('class.is-vertical')
  get classIsVertical() {
    return this.vertical;
  }

  @HostBinding('class.has-appearance-checkbox')
  get classHasAppearanceCheckbox() {
    return this.appearance === 'checkbox';
  }

  @HostBinding('class.has-appearance-button-toggle')
  get classHasAppearanceButtonToggle() {
    return this.appearance === 'button-toggle';
  }

  @HostBinding('class.has-appearance-slide-toggle')
  get classHasAppearanceSliceToggle() {
    return this.appearance === 'slide-toggle';
  }

  @HostBinding('class.has-appearance-radio')
  get classHasAppearanceRadio() {
    return this.appearance === 'radio';
  }

  get hasLabel() {
    return !!this.label;
  }

  get hasHints() {
    return !!this.hints;
  }

  private _last: boolean;
  private _vertical: boolean;
}
