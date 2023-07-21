import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NgrxRouterService } from './ngrx-router.service';

@Injectable({ providedIn: 'root' })
export class ZefNgrxRouterGuard  {
  constructor(private _ngrxRouterService: NgrxRouterService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if ((route.data as any).key && route.params['id']) {
      this._ngrxRouterService.setId((route.data as any).key, route.params['id']);
    }
    return true;
  }

  canDeactivate(_: any, route: ActivatedRouteSnapshot) {
    if ((route.data as any).key && route.params['id']) {
      this._ngrxRouterService.resetId((route.data as any).key);
    }

    return true;
  }
}
