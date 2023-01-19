import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZefDialogModule } from '../../../dialog';
import { DialogErrorContainer } from './dialog-error.container';
import { DialogErrorOutletDirective } from './dialog-error-outlet.directive';

@NgModule({
  declarations: [
    DialogErrorContainer,
    DialogErrorOutletDirective
  ],
  imports: [
    CommonModule,
    ZefDialogModule
  ],
  exports: [
    DialogErrorContainer,
    DialogErrorOutletDirective
  ]
})
export class ZefDialogErrorModule {

}
