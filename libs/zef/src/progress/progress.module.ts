import { NgModule, ModuleWithProviders } from '@angular/core';
import { provideState, StoreModule } from '@ngrx/store';
import { provideEffects, EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME } from './progress.constant';
import { progressReducer } from './progress.reducer';
import { ProgressEffect } from './progress.effect';

@NgModule({
  imports: [
    // StoreModule.forFeature(FEATURE_NAME, progressReducer),
    // EffectsModule.forFeature([ ProgressEffect ])
  ]
})
export class ZefProgressRootModule {

}

@NgModule({})
export class ZefProgressModule {
  static forRoot(): ModuleWithProviders<ZefProgressRootModule> {
    return {
      ngModule: ZefProgressRootModule,
      providers: [
        provideState(FEATURE_NAME, progressReducer),
        provideEffects(ProgressEffect)
      ]
    };
  }
}
