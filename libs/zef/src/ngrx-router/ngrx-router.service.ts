import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { zefSetId, zefResetId } from './ngrx-router.action';

@Injectable({ providedIn: 'root' })
export class NgrxRouterService {
  constructor(private _store: Store<any>) { }

  setId(key: string, id: string) {
    this._store.dispatch(zefSetId(key, id));
  }

  resetId(key: string) {
    this._store.dispatch(zefResetId(key));
  }
}
