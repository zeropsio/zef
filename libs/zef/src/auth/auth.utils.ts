import { Injectable } from '@angular/core';
import { IAuthTokenStorageService, TokenData } from './auth.model';
import { FEATURE_NAME } from './auth.constant';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService implements IAuthTokenStorageService {
  private _data: TokenData;

  setToken(data: TokenData) {
    this._data = data;
    this._updateStorage();
  }

  removeToken() {
    this._data = undefined;
    this._updateStorage();
  }

  getToken() {
    return this._data;
  }

  isValid() {
    return !!(this._data && this._data.accessToken);
  }

  constructor() {
    this._data = this._getStorage();
  }

  private _updateStorage() {
    const d = this._data
      ? JSON.stringify(this._data)
      : '';

    localStorage.setItem(FEATURE_NAME, d);
  }

  private _getStorage() {
    const s = localStorage.getItem(FEATURE_NAME);

    return s ? JSON.parse(s) : undefined;
  }
}
