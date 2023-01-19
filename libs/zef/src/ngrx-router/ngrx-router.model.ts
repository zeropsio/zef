import { HashMap } from '../core';

export interface NgrxRouterActivatedRouteState<P = HashMap<any>> {
  url: string;
  params: P;
  queryParams: P;
  path: string;
  data: P;
}

export class NgrxRouterState {
  idMap: HashMap<string>;
}
