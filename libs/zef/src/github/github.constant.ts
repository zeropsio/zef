import { InjectionToken } from '@angular/core';

export const ZEF_GITHUB_FEATURE_NAME = '@zerops/zef/github';
export const ZEF_GITHUB_AUTH_PROGRESS_KEY = `${ZEF_GITHUB_FEATURE_NAME}/auth-request`;
export const ZEF_GITHUB_CALLBACK_URL = new InjectionToken<string>('zef-github-callback-url');
export const ZEF_GITHUB_API_URL = new InjectionToken<string>('zef-github-api-url');
