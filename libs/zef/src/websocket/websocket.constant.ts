import { InjectionToken } from '@angular/core';
export const FEATURE_NAME = '@zerops/zef/websocket';
export const LOGIN_URL = new InjectionToken<string>('zef-websocket/login-url');
export const HOST = new InjectionToken<string>('zef-websocket/host');
export const API_URL = new InjectionToken<string>('zef-websocket/api-url');
export const FORCE_SECURED_ENDPOINT = new InjectionToken<string>('zef-websocket/force-secured-endpoint');
