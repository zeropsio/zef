import { InjectionToken } from '@angular/core';
export const FEATURE_NAME = '@zerops/zef/websocket';
export const LOGIN_URL = new InjectionToken<string>('zef-websocket/login-url');
export const HOST = new InjectionToken<string>('zef-websocket/host');
export const API_URL = new InjectionToken<string>('zef-websocket/api-url');
export const FORCE_SECURED_ENDPOINT = new InjectionToken<string>('zef-websocket/force-secured-endpoint');
export const TOKEN_NORMALIZER = new InjectionToken<(s: any) => { webSocketToken: string; }>('zef-websocket/token-normalizer');
export const WEBSOCKET_PATH_NORMALIZER = new InjectionToken<(s: { token?: string; receiverId?: string; }) => string>('zef-websocket/websocket-path-normalizer');
export const PING_PONG_ENABLED = new InjectionToken<boolean>('zef-websocket/ping-pong-enabled');
