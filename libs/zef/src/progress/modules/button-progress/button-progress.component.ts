import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'zef-button-progress',
  templateUrl: './button-progress.component.html',
  styleUrls: [ './button-progress.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonProgressComponent {
  @Input()
  set active(v: string | boolean) {
    this._active = coerceBooleanProperty(v);

    if (this.buttonRef) {
      setTimeout(() => {
        this.buttonRef.disabled = this.active;
      });
    }
  }
  get active(): boolean {
    return this._active;
  }

  @Input()
  buttonRef: MatButton;

  private _active: boolean;

}
