import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZefGithubState } from './github.model';
import { ZEF_GITHUB_FEATURE_NAME } from './github.constant';

export const slice = createFeatureSelector<ZefGithubState>(ZEF_GITHUB_FEATURE_NAME);

export const selectZefGithubRepositories = createSelector(slice, (s) => s.repositories);

export const selectZefGithubAuthState = createSelector(slice, (s) => !!s.authorized);

export const selectZefGithubBranchMap = createSelector(slice, (s) => s.branchMap);

