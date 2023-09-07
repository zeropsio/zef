import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IAuthApi, TokenDataGetter } from './auth.model';
import {
  TOKEN_DATA_GETTER,
  API_LOGIN_ENDPOINT,
  API_REFRESH_ENDPOINT,
  API_LOGOUT_ENDPOINT,
  REFRESH_TOKEN_KEY
} from './auth.constant';

interface DefaultResponse {
  auth: any;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class ZefAuthApi implements IAuthApi {

  constructor(
    private _http: HttpClient,
    @Inject(TOKEN_DATA_GETTER)
    private _tokenDataGetter: TokenDataGetter,
    @Inject(API_LOGIN_ENDPOINT)
    private _apiLoginEndpoint: string,
    @Inject(API_REFRESH_ENDPOINT)
    private _apiRefreshEndpoint: string,
    @Inject(API_LOGOUT_ENDPOINT)
    private _apiLogoutEndpoint: string,
    @Inject(REFRESH_TOKEN_KEY)
    private _refreshTokenKey: string
  ) { }


  login$(data: any) {
    return this._http
      .post<DefaultResponse>(
        this._apiLoginEndpoint,
        data
      )
      .pipe(
        map((response) => ({
          tokenData: this._tokenDataGetter(response),
          response
        }))
      );
  }

  logout$() {
    return this._http.post<{ success: true }>(this._apiLogoutEndpoint, {});
  }

  refresh$<D = DefaultResponse>(token: string) {
    return this._http.post<D>(
      this._apiRefreshEndpoint,
      { [this._refreshTokenKey]: token }
    );
  }
}
