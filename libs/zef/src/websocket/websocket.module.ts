import { NgModule, ModuleWithProviders } from '@angular/core';
import { provideState, StoreModule } from '@ngrx/store';
import { provideEffects, EffectsModule } from '@ngrx/effects';

import { WebsocketEffect } from './websocket.effect';
import { WebsocketConfig } from './websocket.model';
import {
  FEATURE_NAME,
  LOGIN_URL,
  HOST,
  API_URL,
  FORCE_SECURED_ENDPOINT,
  TOKEN_NORMALIZER,
  WEBSOCKET_PATH_NORMALIZER,
  PING_PONG_ENABLED,
  PING_PONG_TIMER
} from './websocket.constant';
import { websocketReducer } from './websocket.reducer';

@NgModule({
  imports: [
    // StoreModule.forFeature(FEATURE_NAME, websocketReducer),
    // EffectsModule.forFeature([ WebsocketEffect ])
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
        provideState(FEATURE_NAME, websocketReducer),
        provideEffects(WebsocketEffect),

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
        },
        {
          provide: PING_PONG_ENABLED,
          useValue: config.pingPongEnabled === undefined
            ? true
            : config.pingPongEnabled
        },
        {
          provide: PING_PONG_TIMER,
          useValue: config.pingPongTimer === undefined
            ? 5000
            : config.pingPongTimer
        },
        {
          provide: TOKEN_NORMALIZER,
          useValue: config.tokenNormalizerFn
            ? config.tokenNormalizerFn
            : (data: any) => ({ webSocketToken: data?.webSocketToken })
        },
        {
          provide: WEBSOCKET_PATH_NORMALIZER,
          useValue: config.websocketPathNormalizer
            ? config.websocketPathNormalizer
            : ({ token, receiverId }: {
              token?: string;
              receiverId?: string;
          }) => !!receiverId && !!token
            ? `/${receiverId}/${token}`
            : `/${receiverId}`
        }
      ]
    };
  }
}
