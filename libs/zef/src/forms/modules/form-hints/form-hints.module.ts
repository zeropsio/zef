import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZefFormHintsDirective } from './form-hints.directive';

@NgModule({
  declarations: [ ZefFormHintsDirective ],
  imports: [ CommonModule ],
  exports: [ ZefFormHintsDirective ]
})
export class ZefFormHintsModule { }
