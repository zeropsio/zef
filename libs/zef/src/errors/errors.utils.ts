import { InjectionToken } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export type ErrorExtractorFn = (data: any) => any;

export const errorCodeExtractor = new InjectionToken<ErrorExtractorFn>('zefErrors.errorCodeExtractor');
export const errorMessageExtractor = new InjectionToken<ErrorExtractorFn>('zefErrors.errorMessageExtractor');

export const defaultErrorCodeExtractor = (data: HttpErrorResponse) => data && data.error && data.error.error && data.error.error.code;
export const defaultErrorMessageExtractor = (data: HttpErrorResponse) => data && data.error && data.error.error && data.error.error.message;
