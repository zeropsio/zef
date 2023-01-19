import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { WebsocketEffect } from './websocket.effect';
import { WebsocketConfig } from './websocket.model';
import { FEATURE_NAME, LOGIN_URL, HOST, API_URL, FORCE_SECURED_ENDPOINT } from './websocket.constant';
import { StoreModule } from '@ngrx/store';
import { websocketReducer } from './websocket.reducer';

@NgModule({
  imports: [
    EffectsModule.forFeature([ WebsocketEffect ]),
    StoreModule.forFeature(
      FEATURE_NAME,
      websocketReducer
    )
  ]
})
export class ZefWebsocketRootModule {

}

@NgModule({})
export class ZefWebsocketModule {
  static forRoot(config: WebsocketConfig): ModuleWithProviders<ZefWebsocketRootModule> {
    return {
      ngModule: ZefWebsocketRootModule,
      providers: [
        {
          provide: LOGIN_URL,
          useValue: config.loginUrl
        },
        {
          provide: HOST,
          useValue: config.host
        },
        {
          provide: API_URL,
          useValue: config.apiUrl
        },
        {
          provide: FORCE_SECURED_ENDPOINT,
          useValue: config.forceSecuredEndpoint
        }
      ]
    };
  }
}
