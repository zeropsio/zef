import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { WebsocketEffect } from './websocket.effect';
import { WebsocketConfig } from './websocket.model';
import { FEATURE_NAME, LOGIN_URL, HOST, API_URL, FORCE_SECURED_ENDPOINT, TOKEN_NORMALIZER, WEBSOCKET_PATH_NORMALIZER, PING_PONG_ENABLED } from './websocket.constant';
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
        },
        {
          provide: PING_PONG_ENABLED,
          useValue: config.pingPongEnabled === undefined
            ? true
            : config.pingPongEnabled
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
