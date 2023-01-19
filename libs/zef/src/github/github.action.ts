import { createAction, union } from '@ngrx/store';
import {
  zefActionPayload,
  zefActionFailPayload,
  zefActionSuccessPayload
} from '../core';
import { ZefAuthDefaultResponse } from '../auth';
import {
  ZefGithubAuthUrlType,
  ZefGithubAuthUrlResponse,
  ZefGithubApiAuthorizePayload,
  ZefGithubRepository,
  ZefGithubBranch
} from './github.model';

export const zefGithubAuthUrlRequest = createAction(
  '[@zerops/zef/github] auth-url-request',
  zefActionPayload<{ type: ZefGithubAuthUrlType; recipes: { nonHaRecipeId: string; haRecipeId: string; }; }>()
);

export const zefGithubAuthUrlFail = createAction(
  '[@zerops/zef/github] auth-url-request/fail',
  zefActionFailPayload
);

export const zefGithubAuthUrlSuccess = createAction(
  '[@zerops/zef/github] auth-url-request/success',
  zefActionSuccessPayload<ZefGithubAuthUrlResponse>()
);

export const zefGithubSignupRequest = createAction(
  '[@zerops/zef/github] sign-up',
  zefActionPayload<ZefGithubApiAuthorizePayload>()
);

export const zefGithubSignupFail = createAction(
  '[@zerops/zef/github] sign-up/fail',
  zefActionFailPayload
);

export const zefGithubSignupSuccess = createAction(
  '[@zerops/zef/github] sign-up/success',
  zefActionSuccessPayload<ZefAuthDefaultResponse>()
);

export const zefGithubLoginRequest = createAction(
  '[@zerops/zef/github] login',
  zefActionPayload<ZefGithubApiAuthorizePayload>()
);

export const zefGithubLoginFail = createAction(
  '[@zerops/zef/github] login/fail',
  zefActionFailPayload
);

export const zefGithubLoginSuccess = createAction(
  '[@zerops/zef/github] login/success',
  zefActionSuccessPayload<ZefAuthDefaultResponse>()
);

export const zefGithubRepositoryAccessRequest = createAction(
  '[@zerops/zef/github] repository-access',
  zefActionPayload<ZefGithubApiAuthorizePayload>()
);

export const zefGithubRepositoryAccessFail = createAction(
  '[@zerops/zef/github] repository-access/fail',
  zefActionFailPayload
);

export const zefGithubRepositoryAccessSuccess = createAction(
  '[@zerops/zef/github] repository-access/success',
  zefActionSuccessPayload<{ success: boolean; }>()
);

export const zefGithubRepositoriesRequest = createAction(
  '[@zerops/zef/github] repositories',
  zefActionPayload()
);

export const zefGithubRepositoriesFail = createAction(
  '[@zerops/zef/github] repositories/fail',
  zefActionFailPayload
);

export const zefGithubRepositoriesSuccess = createAction(
  '[@zerops/zef/github] repositories/success',
  zefActionSuccessPayload<{ repositories: ZefGithubRepository[]; }>()
);

export const zefGithubBranchRequest = createAction(
  '[@zerops/zef/github] branch',
  zefActionPayload<string>()
);

export const zefGithubBranchFail = createAction(
  '[@zerops/zef/github] branch/fail',
  zefActionFailPayload
);

export const zefGithubBranchSuccess = createAction(
  '[@zerops/zef/github] branch/success',
  zefActionSuccessPayload<{
    branches: ZefGithubBranch[];
    repositoryName: string;
  }>()
);

const all = union({
  zefGithubAuthUrlRequest,
  zefGithubAuthUrlFail,
  zefGithubAuthUrlSuccess,
  zefGithubLoginRequest,
  zefGithubLoginFail,
  zefGithubLoginSuccess,
  zefGithubSignupRequest,
  zefGithubSignupFail,
  zefGithubSignupSuccess,
  zefGithubRepositoryAccessRequest,
  zefGithubRepositoryAccessFail,
  zefGithubRepositoryAccessSuccess
});
export type GithubActionUnion = typeof all;
