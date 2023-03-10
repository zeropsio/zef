import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';

import { SatPopover, SatPopoverAnchor } from './popover.component';
import { SatPopoverHoverDirective } from './popover-hover.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    MatIconModule,
    A11yModule,
    BidiModule,
  ],
  declarations: [
    SatPopover,
    SatPopoverAnchor,
    SatPopoverHoverDirective,
  ],
  exports: [
    SatPopover,
    SatPopoverAnchor,
    SatPopoverHoverDirective,
    BidiModule,
  ]
})
export class SatPopoverModule { }
