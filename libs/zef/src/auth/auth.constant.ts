import { InjectionToken } from '@angular/core';

export const FEATURE_NAME = '@zerops/zef/auth';
export const TOKEN_DATA_GETTER = new InjectionToken<string>('zef-auth/token-data-getter');
export const API_LOGIN_ENDPOINT = new InjectionToken<string>('zef-auth/api-login-prefix');
export const API_LOGOUT_ENDPOINT = new InjectionToken<string>('zef-auth/api-logout-prefix');
export const API_REFRESH_ENDPOINT = new InjectionToken<string>('zef-auth/api-refresh-prefix');
export const REFRESH_TOKEN_KEY = new InjectionToken<string>('zef-auth/refresh-token-key');
