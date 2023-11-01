import { NgModule, ModuleWithProviders } from '@angular/core';
import { provideRouterStore, StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { provideState, StoreModule } from '@ngrx/store';
import { provideEffects, EffectsModule } from '@ngrx/effects';

import { NgrxRouterEffect } from './ngrx-router.effect';
import { NgrxRouterSerializer } from './ngrx-router.utils';
import { FEATURE_NAME, NGRX_ROUTER_IDS_FEATURE_NAME } from './ngrx-router.constant';
import { ngrxRouterStateReducer } from './ngrx-router.reducer';

@NgModule({
  imports: [
    // StoreModule.forFeature(NGRX_ROUTER_IDS_FEATURE_NAME, ngrxRouterStateReducer),
    // StoreModule.forFeature(FEATURE_NAME, routerReducer),
    // EffectsModule.forFeature([ NgrxRouterEffect ]),
    // StoreRouterConnectingModule.forRoot({ serializer: NgrxRouterSerializer })
  ]
})
export class ZefNgrxRouterRootModule {
}

@NgModule({
})
export class ZefNgrxRouterModule {
  static forRoot(): ModuleWithProviders<ZefNgrxRouterRootModule> {
    return {
      ngModule: ZefNgrxRouterRootModule,
      providers: [
        provideState(NGRX_ROUTER_IDS_FEATURE_NAME, ngrxRouterStateReducer),
        provideState(FEATURE_NAME, routerReducer),
        provideEffects(NgrxRouterEffect),
        provideRouterStore({serializer: NgrxRouterSerializer})
      ]
    };
  }
}

