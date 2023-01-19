import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ButtonProgressModule } from '../progress';
import { SatPopoverModule } from '../popover';
import { ProgressErrorContainer } from './progress-error.container';

@NgModule({
  declarations: [ ProgressErrorContainer ],
  imports: [
    CommonModule,
    MatIconModule,
    SatPopoverModule,
    ButtonProgressModule
  ],
  exports: [ ProgressErrorContainer ]
})
export class ZefProgressErrorModule {

}
