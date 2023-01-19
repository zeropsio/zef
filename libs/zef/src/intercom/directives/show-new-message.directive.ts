import {Directive, HostListener, Input} from '@angular/core'

import {Intercom} from '../intercom.service'

/* tslint:disable:directive-selector */
@Directive({
  selector: '[zefIntercomShowNewMessage]'
})
export class IntercomShowNewMessageDirective {
  @Input() message: string
  @Input() intercomShowNewMessage: string

  constructor(private intercom: Intercom) {
  }

  @HostListener('click')
  onClick() {
    const msg = this.message ? this.message : this.intercomShowNewMessage
    if (msg) {
      this.intercom.showNewMessage(this.message)
    }
    else {
      this.intercom.showNewMessage()
    }
  }
}
