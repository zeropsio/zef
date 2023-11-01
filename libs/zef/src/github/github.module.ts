import { NgModule, ModuleWithProviders } from '@angular/core';
import { provideState, StoreModule } from '@ngrx/store';
import { provideEffects, EffectsModule } from '@ngrx/effects';

import { ZefGithubConfig } from './github.model';
import { ZefGithubEffect } from './github.effect';
import { githubReducer } from './github.reducer';
import { ZEF_GITHUB_API_URL, ZEF_GITHUB_CALLBACK_URL, ZEF_GITHUB_FEATURE_NAME } from './github.constant';

@NgModule({
  imports: [
    // StoreModule.forFeature(ZEF_GITHUB_FEATURE_NAME, githubReducer),
    // EffectsModule.forFeature([ ZefGithubEffect ])
  ]
})
export class ZefGithubModule {
  static forRoot(config?: ZefGithubConfig): ModuleWithProviders<ZefGithubModule> {
    return {
      ngModule: ZefGithubModule,
      providers: [
        provideState(ZEF_GITHUB_FEATURE_NAME, githubReducer),
        provideEffects(ZefGithubEffect),
        {
          provide: ZEF_GITHUB_CALLBACK_URL,
          useValue: config?.callbackUrl
        },
        {
          provide: ZEF_GITHUB_API_URL,
          useValue: config?.apiUrl
        }
      ]
    };
  }

}
