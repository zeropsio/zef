import { Observable } from 'rxjs';

export enum ZefAuthState {
  Authorized = 'authorized',
  Checking = 'checking',
  Invalid = 'invalid'
}

export type TokenDataGetter = (response: any) => TokenData;

export interface AuthModuleConfig {
  tokenDataGetter?: TokenDataGetter;
  loginEndpoint?: string;
  logoutEndpoint?: string;
  refreshEndpoint?: string;
  refreshTokenKey?: string;
}

export class AuthApiState {
  state: ZefAuthState;
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    expiresIn?: number;
    userId?: any;
    author?: {
      authorType?: 'BACKOFFICE' | 'CLIENT';
    };
  };

  constructor() {
    this.state = ZefAuthState.Checking;
  }
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  expiresIn?: number;
  userId?: string;
  author?: {
    authorType?: 'BACKOFFICE' | 'CLIENT';
  };
}

export interface IAuthApi {
  login$(...args: any[]): Observable<{ tokenData: TokenData; response?: any; }>;
}

export interface IAuthTokenStorageService {
  setToken(data: TokenData): void;
  removeToken(): void;
  getToken(): TokenData;
  isValid(): boolean;
}

export interface ZefAuthDefaultResponse {
  auth: any;
  user: any;
}
