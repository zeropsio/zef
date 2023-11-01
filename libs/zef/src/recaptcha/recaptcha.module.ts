import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { provideState, StoreModule } from '@ngrx/store';
import { NgxCaptchaModule } from 'ngx-captcha';

import { ZefDialogModule } from '../dialog';
import { recaptchaReducer } from './recaptcha.reducer';
import { FEATURE_NAME } from './recaptcha.constant';
import { recaptchaInterceptorProvider } from './recaptcha.interceptor';
import { RecaptchaContainer } from './recaptcha.container';

@NgModule({
  imports: [
    // StoreModule.forFeature(FEATURE_NAME, recaptchaReducer)
  ],
  providers: [ recaptchaInterceptorProvider ]
})
export class ZefRecaptchaRootModule {

}

@NgModule({
  declarations: [ RecaptchaContainer ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    ZefDialogModule
  ],
  exports: [ RecaptchaContainer ],
})
export class ZefRecaptchaModule {
  static forRoot(): ModuleWithProviders<ZefRecaptchaRootModule> {
    return {
      ngModule: ZefRecaptchaRootModule,
      providers: [
        provideState(FEATURE_NAME, recaptchaReducer)
      ]
    };
  }
}
