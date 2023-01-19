import { AuthPopupWindow } from '../core';
import { ZefGithubAuthStateData } from './github.model';

export const loginWithGithub = (url: any, options?: any, id?: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const popup = AuthPopupWindow.open(url, options, id);
    popup.then(resolve, reject);
  });
};

export const parseGithubAuthState = (data: string) => {
  try {
    return JSON.parse(window.atob(data)) as ZefGithubAuthStateData;
  } catch (e) {
    console.warn('GitHub state parse error.');

    return undefined;
  }
};
