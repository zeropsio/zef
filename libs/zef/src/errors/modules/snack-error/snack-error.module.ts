import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackErrorComponent } from './snack-error.component';
import { SnackErrorOutletDirective } from './snack-error-outlet.directive';

@NgModule({
    declarations: [
        SnackErrorComponent,
        SnackErrorOutletDirective
    ],
    imports: [CommonModule],
    exports: [SnackErrorOutletDirective]
})
export class ZefSnackErrorModule {

}
