import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ZefSnackOutletDirective } from './snack-outlet.directive';
import { ZefSnackComponent } from './snack.component';

@NgModule({
    declarations: [
        ZefSnackOutletDirective,
        ZefSnackComponent
    ],
    imports: [
        CommonModule,
        MatSnackBarModule,
    ],
    exports: [ZefSnackOutletDirective]
})
export class ZefSnackModule {

}
