import { Component, ContentChild } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ZefFormElementDirective } from '../form-element';

@Component({
  selector: 'zef-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: [ './password-field.component.scss' ]
})
export class ZefPasswordFieldComponent {

  @ContentChild(ZefFormElementDirective, { static: true })
  elementDirectiveRef: ZefFormElementDirective;

  set showPassword(v: string | boolean) {
    this._showPassword = coerceBooleanProperty(v);

    if (this.elementDirectiveRef) {
      this.elementDirectiveRef.elRef.nativeElement.type = this.showPassword
        ? 'text'
        : 'password';
    }
  }
  get showPassword(): boolean {
    return this._showPassword;
  }

  private _showPassword = false;
}
