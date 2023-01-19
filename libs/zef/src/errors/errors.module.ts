import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  ZefSnackErrorModule,
  ZefPopErrorModule,
  ZefDialogErrorModule
} from './modules';
import { FEATURE_NAME, UNIQUE_ERRORS, BLACKLISTED_ERRORS } from './errors.constant';
import { errorsReducer } from './errors.reducer';
import { ErrorsEffect } from './errors.effect';
import { ErrorsInterceptor } from './errors.interceptor';
import {
  errorCodeExtractor,
  defaultErrorCodeExtractor,
  errorMessageExtractor,
  defaultErrorMessageExtractor
} from './errors.utils';
import { ZefErrorRootConfig } from './errors.model';

@NgModule({
  imports: [
    MatSnackBarModule,
    StoreModule.forFeature(FEATURE_NAME, errorsReducer),
    EffectsModule.forFeature([ ErrorsEffect ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    },
    {
      provide: errorCodeExtractor,
      useValue: defaultErrorCodeExtractor
    },
    {
      provide: errorMessageExtractor,
      useValue: defaultErrorMessageExtractor
    }
  ]
})
export class ZefErrorsRootModule { }

@NgModule({
  imports: [
    ZefSnackErrorModule,
    ZefPopErrorModule,
    ZefDialogErrorModule
  ],
  exports: [
    ZefSnackErrorModule,
    ZefPopErrorModule,
    ZefDialogErrorModule
  ]
})
export class ZefErrorsModule {
  static forRoot(config?: ZefErrorRootConfig): ModuleWithProviders<ZefErrorsRootModule> {
    return {
      ngModule: ZefErrorsRootModule,
      providers: [
        {
          provide: UNIQUE_ERRORS,
          useValue: config && config.uniqueErrors.length
            ? config.uniqueErrors
            : []
        },
        {
          provide: BLACKLISTED_ERRORS,
          useValue: config && config.blacklistedErrors.length
            ? config.blacklistedErrors
            : []
        }
      ]
    };
  }
}
