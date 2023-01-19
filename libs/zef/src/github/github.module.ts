import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZEF_GITHUB_API_URL, ZEF_GITHUB_CALLBACK_URL, ZEF_GITHUB_FEATURE_NAME } from './github.constant';
import { ZefGithubConfig } from './github.model';
import { EffectsModule } from '@ngrx/effects';
import { ZefGithubEffect } from './github.effect';
import { StoreModule } from '@ngrx/store';
import { githubReducer } from './github.reducer';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      ZefGithubEffect
    ]),
    StoreModule.forFeature(
      ZEF_GITHUB_FEATURE_NAME,
      githubReducer
    )
  ]
})
export class ZefGithubModule {
  static forRoot(config?: ZefGithubConfig): ModuleWithProviders<ZefGithubModule> {
    return {
      ngModule: ZefGithubModule,
      providers: [
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
