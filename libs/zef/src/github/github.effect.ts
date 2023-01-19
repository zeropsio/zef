import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { zefRemoveError } from '../errors';
import { of, from, concat } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import {
  zefGithubAuthUrlRequest,
  zefGithubAuthUrlFail,
  zefGithubAuthUrlSuccess,
  zefGithubSignupRequest,
  zefGithubSignupSuccess,
  zefGithubSignupFail,
  zefGithubLoginRequest,
  zefGithubLoginSuccess,
  zefGithubLoginFail,
  zefGithubRepositoryAccessRequest,
  zefGithubRepositoryAccessSuccess,
  zefGithubRepositoryAccessFail,
  zefGithubRepositoriesRequest,
  zefGithubRepositoriesSuccess,
  zefGithubRepositoriesFail,
  zefGithubBranchRequest,
  zefGithubBranchSuccess,
  zefGithubBranchFail
} from './github.action';
import { ZefGithubService } from './github.service';
import { ZefGithubApiAuthorizePayload, ZefGithubAuthUrlType } from './github.model';
import { loginWithGithub, parseGithubAuthState } from './github.utils';
import { zefAddProgress, zefRemoveProgress } from '../progress';
import { ZEF_GITHUB_AUTH_PROGRESS_KEY } from './github.constant';

@Injectable({ providedIn: 'root' })
export class ZefGithubEffect {

  private _onGetAuthUrl$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubAuthUrlRequest),
    switchMap((action) => this._api
      .getAuthUrl(action.data.type, action.data.recipes)
      .pipe(
        map((res) => zefGithubAuthUrlSuccess(res, action)),
        catchError((err) => of(zefGithubAuthUrlFail(err, action)))
      )
    )
  ));

  private _onGetAuthUrlSuccess$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubAuthUrlSuccess),
    tap(({ data }) => {
      window.location.href = data.githubUrl;
    })
  ), { dispatch: false });

  private _onSignupRequest$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubSignupRequest),
    switchMap((action) => this._api
      .signup(action.data)
      .pipe(
        map((res) => zefGithubSignupSuccess(res, action)),
        catchError((err) => {

          // registration with existing user performs login
          if (err.code === 'emailExists') {
            const parsed = parseGithubAuthState(action.data?.state);

            return of(zefGithubAuthUrlRequest({
              type: ZefGithubAuthUrlType.Login,
              recipes: { nonHaRecipeId: parsed.nonHaRecipe, haRecipeId: parsed.haRecipe }
            }));
          }

          return of(zefGithubSignupFail(err, action));
        })
      )
    )
  ));

  private _onLoginRequest$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubLoginRequest),
    switchMap((action) => this._api
      .login(action.data)
      .pipe(
        map((res) => zefGithubLoginSuccess(res, action)),
        catchError((err) => {

          // login with non existing user performs registration
          if (err.code === 'userAccountNotFound') {
            return of(zefGithubAuthUrlRequest({
              type: ZefGithubAuthUrlType.Registration
            }));
          }

          return of(zefGithubLoginFail(err, action));
        })
      )
    )
  ));

  private _onRepositoryAccessRequest$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubRepositoryAccessRequest),
    switchMap((action) => this._api
      .repositoryAccess(action.data)
      .pipe(
        map((res) => zefGithubRepositoryAccessSuccess(res, action)),
        catchError((err) => of(zefGithubRepositoryAccessFail(err, action)))
      )
    )
  ));

  private _onRepositoriesRequest$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubRepositoriesRequest),
    switchMap((action) => this._api
      .repositories()
      .pipe(
        map((res) => zefGithubRepositoriesSuccess(res, action)),
        catchError((err) => of(zefGithubRepositoriesFail(err, action)))
      )
    )
  ));

  private _onBranchRequest$ = createEffect(() => this._actions$.pipe(
    ofType(zefGithubBranchRequest),
    switchMap((action) => this._api
      .repositoryBranch(action.data)
      .pipe(
        map(({ branches }) => zefGithubBranchSuccess(
          { branches, repositoryName: action.data },
          action
        )),
        catchError((err) => of(zefGithubBranchFail(err, action)))
      )
    )
  ));

  private _onRepositoriesFailTryAuth$ = createEffect(() => this._actions$.pipe(
    // when repositories request fails
    ofType(zefGithubRepositoriesFail),
    switchMap(() => concat(
      // manually add auth progress, since it's a mix
      // of different api calls
      of(zefAddProgress(ZEF_GITHUB_AUTH_PROGRESS_KEY)),
      // get auth URL from zerops api
      this._api
        .getAuthUrl(ZefGithubAuthUrlType.Repository)
        .pipe(
          // open new pop window with given url to try and get github auth token
          switchMap(({ githubUrl }) => from(loginWithGithub(githubUrl)).pipe(
            map((res) => res),
            catchError(() => of(undefined))
          )),
          catchError(() => of(undefined)),
          switchMap((data) => {

            // if response from github auth pop window contains error
            // or we caught any error from our API, return undefined
            if (data?.['error'] || data === undefined) {
              return of(undefined);
            }

            // otherwise try to write the github response to zerops
            return this._api
              .repositoryAccess(data as ZefGithubApiAuthorizePayload)
              .pipe(catchError(() => of(undefined)));

          }),
          switchMap((data) => {
            // if we got back data, we should now have permissions
            // to read github repositories, so repeat repositories request
            // and remove the auth progress
            if (data) {
              return [
                zefGithubRepositoriesRequest(),
                zefRemoveProgress(ZEF_GITHUB_AUTH_PROGRESS_KEY)
              ];
            } else {
              // otherwise remove the original error and the progress
              // and give up
              return [
                zefRemoveError(zefGithubRepositoriesRequest.type),
                zefRemoveProgress(ZEF_GITHUB_AUTH_PROGRESS_KEY)
              ];
            }
          })
        )
      )
    )
  ));

  constructor(
    private _actions$: Actions,
    private _api: ZefGithubService
  ) { }

}
