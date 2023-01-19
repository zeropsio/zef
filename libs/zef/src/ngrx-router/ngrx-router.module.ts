import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { NgrxRouterEffect } from './ngrx-router.effect';
import { NgrxRouterSerializer } from './ngrx-router.utils';
import { FEATURE_NAME, NGRX_ROUTER_IDS_FEATURE_NAME } from './ngrx-router.constant';
import { ngrxRouterStateReducer } from './ngrx-router.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(NGRX_ROUTER_IDS_FEATURE_NAME, ngrxRouterStateReducer),
    StoreModule.forFeature(FEATURE_NAME, routerReducer),
    EffectsModule.forFeature([ NgrxRouterEffect ]),
    StoreRouterConnectingModule.forRoot({
      serializer: NgrxRouterSerializer
    })
  ]
})
export class ZefNgrxRouterRootModule {
}

@NgModule({
})
export class ZefNgrxRouterModule {
  static forRoot(): ModuleWithProviders<ZefNgrxRouterRootModule> {
    return {
      ngModule: ZefNgrxRouterRootModule
    };
  }
}

