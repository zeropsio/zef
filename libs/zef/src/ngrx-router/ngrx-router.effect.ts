import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { zefGo, zefBack, zefForward } from './ngrx-router.action';

@Injectable()
export class NgrxRouterEffect {

  private _onGo$ = createEffect(() => this._actions$.pipe(
    ofType(zefGo),
    tap(({ path, query: queryParams, extras }) => {
      this._router.navigate(
        path,
        {
          queryParams,
          ...extras
        }
      );
    })
  ), { dispatch: false });

  private _onBack$ = createEffect(() => this._actions$.pipe(
    ofType(zefBack),
    tap(() => this._location.back())
  ), { dispatch: false });

  private _onForward$ = createEffect(() => this._actions$.pipe(
    ofType(zefForward),
    tap(() => this._location.forward())
  ), { dispatch: false });

  constructor(
    private _actions$: Actions<any>,
    private _location: Location,
    private _router: Router
  ) { }
}
