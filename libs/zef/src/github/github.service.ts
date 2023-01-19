import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZefAuthDefaultResponse } from '../auth';
import {
  ZefGithubAuthUrlType,
  ZefGithubAuthUrlResponse,
  ZefGithubApiAuthorizePayload,
  ZefGithubRepository,
  ZefGithubBranch
} from './github.model';
import { ZEF_GITHUB_API_URL, ZEF_GITHUB_CALLBACK_URL } from './github.constant';

@Injectable({ providedIn: 'root' })
export class ZefGithubService {
  constructor(
    @Inject(ZEF_GITHUB_CALLBACK_URL)
    private _callbackUrl: string,
    @Inject(ZEF_GITHUB_API_URL)
    private _apiUrl: string,
    private _http: HttpClient
  ) { }

  getAuthUrl(action: ZefGithubAuthUrlType, recipes?: { nonHaRecipeId: string; haRecipeId: string; }) {
    return this._http.get<ZefGithubAuthUrlResponse>(
      this._apiUrl ? (this._apiUrl + '/github/auth-url') : '/api/github/auth-url',
      {
        params: {
          action,
          nonHaRecipe: recipes?.nonHaRecipeId,
          haRecipe: recipes?.haRecipeId,
          redirectUrl: this._callbackUrl
        }
      }
    );
  }

  login(data: ZefGithubApiAuthorizePayload) {
    return this._http.post<ZefAuthDefaultResponse>(
      '/api/github/user-login',
      data
    );
  }

  signup(data: ZefGithubApiAuthorizePayload) {
    return this._http.post<ZefAuthDefaultResponse>(
      '/api/github/user-registration',
      data
    );
  }

  repositoryAccess(data: ZefGithubApiAuthorizePayload) {
    return this._http.post<{ success: boolean; }>(
      '/api/github/user-repository-access',
      data
    );
  }

  repositories() {
    return this._http.get<{ repositories: ZefGithubRepository[]; }>(
      '/api/github/repository'
    );
  }

  repositoryBranch(repositoryFullName: string) {
    return this._http.get<{ branches: ZefGithubBranch[]; }>(
      '/api/github/repository-branch',
      {
        params: {
          repositoryFullName
        }
      }
    );
  }

}
