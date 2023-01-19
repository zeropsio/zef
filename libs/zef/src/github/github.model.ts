export class ZefGithubState {
  repositories: ZefGithubRepository[];
  authorized: boolean;
  branchMap: {
    [repositoryName: string]: ZefGithubBranch[]
  };
}

export enum ZefGithubAuthUrlType {
  Registration = 'REGISTRATION',
  Login = 'LOGIN',
  Repository = 'REPOSITORY'
}

export interface ZefGithubConfig {
  callbackUrl?: string;
  apiUrl?: string;
}

export interface ZefGithubRepository {
  fullName: string;
  name: string;
  owner: string;
  ownerUrl: string;
  private: boolean;
}

export interface ZefGithubBranch {
  name: string;
  isDefault: boolean;
}

export interface ZefGithubAuthUrlResponse {
  githubUrl: string;
}

export interface ZefGithubApiAuthorizePayload {
  state: string;
  code: string;
}

export interface ZefGithubAuthStateData {
  action: ZefGithubAuthUrlType;
  key: string;
  nonHaRecipe?: string;
  haRecipe?: string;
}
