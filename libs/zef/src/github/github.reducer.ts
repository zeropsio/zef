import { createReducer, on } from '@ngrx/store';
import { zefResetState } from '../core';
import { ZefGithubState } from './github.model';
import { GithubActionUnion, zefGithubRepositoriesSuccess, zefGithubBranchSuccess } from './github.action';

export const initialState = new ZefGithubState();

const actionReducer = createReducer(
  initialState,
  on(zefGithubRepositoriesSuccess, (s: ZefGithubState, d): ZefGithubState => ({
    ...s,
    repositories: d.data.repositories,
    authorized: true
  })),
  on(zefGithubBranchSuccess, (s: ZefGithubState, d): ZefGithubState => ({
    ...s,
    branchMap: {
      ...s.branchMap,
      [d.data.repositoryName]: d.data.branches
    }
  })),
  on(zefResetState, (): ZefGithubState => initialState)
);

export function githubReducer(
  state = initialState,
  action: GithubActionUnion
) {
  return actionReducer(state, action);
}
