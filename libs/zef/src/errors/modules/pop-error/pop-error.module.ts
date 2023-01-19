import { NgModule } from '@angular/core';
import { SatPopoverModule } from '../../../popover';
import { PopErrorOutletDirective } from './pop-error-outlet.directive';

@NgModule({
  declarations: [ PopErrorOutletDirective ],
  imports: [ SatPopoverModule ],
  exports: [ PopErrorOutletDirective ]
})
export class ZefPopErrorModule {

}
