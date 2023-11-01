import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { provideState, StoreModule } from '@ngrx/store';

import { NgrxDialogCloseModule, NgrxDialogOpenModule } from './modules';
import { DialogComponent } from './dialog.component';
import { dialogReducer } from './dialog.reducer';
import { FEATURE_NAME } from './dialog.constant';

@NgModule({
  imports: [
    // StoreModule.forFeature(FEATURE_NAME, dialogReducer)
  ]
})
export class ZefDialogRootModule {
}

@NgModule({
  declarations: [ DialogComponent ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    DialogComponent,
    NgrxDialogCloseModule,
    NgrxDialogOpenModule
  ]
})
export class ZefDialogModule {
  static forRoot(): ModuleWithProviders<ZefDialogRootModule> {
    return {
      ngModule: ZefDialogRootModule,
      providers: [
        provideState(FEATURE_NAME, dialogReducer)
      ]
    };
  }
}
