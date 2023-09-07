import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  FEATURE_NAME,
  TOKEN_DATA_GETTER,
  API_LOGIN_ENDPOINT,
  API_LOGOUT_ENDPOINT,
  API_REFRESH_ENDPOINT,
  REFRESH_TOKEN_KEY
} from './auth.constant';
import { authReducer } from './auth.reducer';
import { AuthEffect } from './auth.effect';
import { AuthModuleConfig } from './auth.model';
import { authTokenInterceptorProvider } from './auth-token.interceptor';

@NgModule({
  imports: [
    StoreModule.forFeature(FEATURE_NAME, authReducer),
    EffectsModule.forFeature([ AuthEffect ])
  ]
})
export class ZefAuthRootModule {

}

export function defaultTokenGetter(response: any) {
  return response.auth;
}

@NgModule({})
export class ZefAuthModule {
  static forRoot(config?: AuthModuleConfig): ModuleWithProviders<ZefAuthRootModule> {
    console.log(config, config && config.refreshTokenKey
      ? config.refreshTokenKey
      : 'refreshTokenId');

    return {
      ngModule: ZefAuthRootModule,
      providers: [
        {
          provide: TOKEN_DATA_GETTER,
          useValue: config && config.tokenDataGetter
            ? config.tokenDataGetter
            : defaultTokenGetter
        },
        {
          provide: API_LOGIN_ENDPOINT,
          useValue: config && config.loginEndpoint
            ? config.loginEndpoint
            : ''
        },
        {
          provide: API_LOGOUT_ENDPOINT,
          useValue: config && config.logoutEndpoint
            ? config.logoutEndpoint
            : ''
        },
        {
          provide: API_REFRESH_ENDPOINT,
          useValue: config && config.refreshEndpoint
            ? config.refreshEndpoint
            : ''
        },
        {
          provide: REFRESH_TOKEN_KEY,
          useValue: config && config.refreshTokenKey
            ? config.refreshTokenKey
            : 'refreshTokenId'
        },
        authTokenInterceptorProvider
      ]
    };
  }
}
