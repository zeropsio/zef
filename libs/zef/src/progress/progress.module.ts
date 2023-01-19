import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FEATURE_NAME } from './progress.constant';
import { progressReducer } from './progress.reducer';
import { ProgressEffect } from './progress.effect';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_NAME, progressReducer),
    EffectsModule.forFeature([ ProgressEffect ])
  ]
})
export class ZefProgressRootModule {

}

@NgModule({})
export class ZefProgressModule {
  static forRoot(): ModuleWithProviders<ZefProgressRootModule> {
    return {
      ngModule: ZefProgressRootModule
    };
  }
}
