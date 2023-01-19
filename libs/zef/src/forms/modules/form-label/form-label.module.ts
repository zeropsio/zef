import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZefFormLabelDirective } from './form-label.directive';

@NgModule({
  declarations: [ ZefFormLabelDirective ],
  imports: [ CommonModule ],
  exports: [ ZefFormLabelDirective ]
})
export class ZefFormLabelModule { }
