import {
  Injectable,
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ZefPermissionService {
  private _store = {};

  define(name: string, validation) {
    this._store[name] = validation;
  }

  authorize(authObj: any) {
    if (authObj.only && authObj.except) {
      throw new Error('Authorization object cannot contain both [only] and [except]');
    }

    if (authObj.only) {
      return this._checkAuthorization(authObj.only, 'only');
    }

    if (authObj.except) {
      return this._checkAuthorization(authObj.except, 'except');
    }

  }

  private _checkAuthorization(names, type) {
    const mergeObsrArr: Array<Observable<boolean>> = [];

    names.forEach((res: any) => {
      if (this._store[res]) {
        mergeObsrArr.push(this._store[res].call());
      } else {
        console.warn(`Permission: No defined validation for ${res}`);
      }
    });

    return combineLatest([ ...mergeObsrArr ]).pipe(
      map((res: boolean[]) => {

        const r = res.some((x) => x === true);
        if (type === 'only') {
          return !!r;
        }
        if (type === 'except') {
          return !r;
        }
      })
    );
  }
}
