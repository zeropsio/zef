import { ModuleWithProviders, NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { IntercomHideDirective } from './directives/hide.directive'
import { IntercomShowMessagesDirective } from './directives/show-messages.directive'
import { IntercomShowNewMessageDirective } from './directives/show-new-message.directive'
import { IntercomShowDirective } from './directives/show.directive'
import { IntercomShutdownDirective } from './directives/shutdown.directive'
import { IntercomTrackEventDirective } from './directives/track-event.directive'
import { IntercomConfig } from './intercom-config.service'
import { Intercom } from './intercom.service'

@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [
    IntercomHideDirective,
    IntercomShowMessagesDirective,
    IntercomShowNewMessageDirective,
    IntercomShowDirective,
    IntercomShutdownDirective,
    IntercomTrackEventDirective
  ],
  exports: [
    IntercomHideDirective,
    IntercomShowMessagesDirective,
    IntercomShowNewMessageDirective,
    IntercomShowDirective,
    IntercomShutdownDirective,
    IntercomTrackEventDirective
  ],
  providers: [
    Intercom,
    IntercomConfig
  ]
})
export class ZefIntercomModule {
  static forRoot(config: IntercomConfig): ModuleWithProviders<ZefIntercomModule> {
    return {
      ngModule: ZefIntercomModule,
      providers: [
        Intercom,
        { provide: IntercomConfig, useValue: config },
      ]
    }
  }
}
