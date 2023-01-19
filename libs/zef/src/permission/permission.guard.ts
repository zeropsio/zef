import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ZefPermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class ZefPermissionGuard implements CanActivate {
  constructor(
    private _permission: ZefPermissionService,
    private _router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {

    return this._permission
      .authorize(route.data['zefPermissions'].rule)
      .pipe(
        take(1),
        map((res) => {
          if (res) {
            return true;
          } else {
            if (route.data['zefPermissions'].redirectTo) {
              this._router.navigate(route.data['zefPermissions'].redirectTo);
            }
            return false;
          }
        })
      );
  }
}
