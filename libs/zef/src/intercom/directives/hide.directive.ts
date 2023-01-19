import { Directive, HostListener, Input } from '@angular/core'

import { Intercom } from '../intercom.service'

/* tslint:disable:directive-selector */
@Directive({
  selector: '[zefIntercomHide]'
})
export class IntercomHideDirective {
  @Input() intercomHide: boolean

  constructor(
    private intercom: Intercom
  ) { }

  @HostListener('click')
  public onClick(): void {
    if (this.intercomHide !== false) {
        this.intercom.hide()
    }
  }
}
