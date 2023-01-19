import { RouterStateSnapshot } from '@angular/router';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  RouterStateSerializer
} from '@ngrx/router-store';
import { ofType } from '@ngrx/effects';
import { HashMap } from '../core';
import { NgrxRouterActivatedRouteState } from './ngrx-router.model';
import { zefSetId } from './ngrx-router.action';

export function isRoute(route: string | string[] | RegExp) {
  return (action: Action) => {
    const isRouteAction = action.type === ROUTER_NAVIGATION;

    if (isRouteAction) {

      const routeAction = action as RouterNavigationAction<NgrxRouterActivatedRouteState>;
      const routePath = routeAction.payload.routerState.path;

      if (Array.isArray(route)) {
        return route.indexOf(routePath) > -1;
      } else if (route instanceof RegExp) {
        return route.test(routePath);
      } else {
        return routePath === route;
      }
    }

    return isRouteAction;
  };
}

export function ofRoute<P = HashMap<any>>(
  route: string | string[] | RegExp
): MonoTypeOperatorFunction<RouterNavigationAction<NgrxRouterActivatedRouteState<P>>> {
  return filter<RouterNavigationAction<NgrxRouterActivatedRouteState<P>>>(isRoute(route));
}

export class NgrxRouterSerializer implements RouterStateSerializer<NgrxRouterActivatedRouteState> {
  serialize(routerState: RouterStateSnapshot): NgrxRouterActivatedRouteState {
    let route = routerState.root;
    const path: any[] = [];
    let data: HashMap<any> = {};

    while (route.firstChild) {
      route = route.firstChild;
      data = { ...data, [(route.data as any).key]: route.data };
      if (route.routeConfig && route.routeConfig.path) {
        path.push(route.routeConfig.path);
      }
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;

    return {
      url,
      params: params as HashMap<any>,
      queryParams: queryParams as HashMap<any>,
      path: path.join('/'),
      data
    };
  }
}

export const onSetId = (routeKey: string) => (source: Observable<Action>) => source.pipe(
  ofType(zefSetId),
  filter(({ key }) => key === routeKey),
  map(({ id }) => id)
);
