import { InjectionToken } from '@angular/core';

export const FEATURE_NAME = '@zerops/zef/errors';

export const BLACKLISTED_ERRORS = new InjectionToken<number[]>('@zerops/zef/errors/BLACKLISTED_ERRORS');
export const UNIQUE_ERRORS = new InjectionToken<number[]>('@zerops/zef/errors/UNIQUE_ERRORS');
