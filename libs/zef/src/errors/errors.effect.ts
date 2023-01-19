import { Injectable, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, withLatestFrom, switchMap } from 'rxjs/operators';
import { zefAddError, zefRemoveError } from './errors.action';
import { select, Store } from '@ngrx/store';
import { selectZefErrors } from './errors.selector';
import { SnackErrorComponent } from './modules';
import { UNIQUE_ERRORS, BLACKLISTED_ERRORS } from './errors.constant';

@Injectable()
export class ErrorsEffect {

  private _onActionWithErrorAdd$ = createEffect(() => this._actions$.pipe(
    filter((action: any) => action.originalAction
      && action.originalAction.zefError
      && action.meta
      && action.meta.zefError
      && !this._blacklistedErrors.includes(action.meta.zefError.status)
    ),
    withLatestFrom(this._store.pipe(select(selectZefErrors))),
    map(([ action, errors ]) => {
      // check if the error we are trying to add is not supposed to be unique
      if (this._uniqueErrors.length && !!errors.find((err) => this._uniqueErrors.includes(err.originalError.status))) {
        return undefined;
      }

      return zefAddError(
        action.originalAction.type,
        action.meta.zefError.code,
        action.meta.zefError.message,
        (action.originalAction.data && action.originalAction.data.id)
          ? action.originalAction.data.id
          : undefined,
        action.meta.zefError.originalError,
        action.originalAction.zefError.type,
        action.originalAction
      );
    }),
    filter((a) => !!a)
  ));

  private _onActionWithErrorRemove$ = createEffect(() => this._actions$.pipe(
    filter((action) => action.zefError),
    withLatestFrom(this._store.pipe(select(selectZefErrors))),
    filter(([ action, state ]) => !!state.find((item) => {
      if (action.data && action.data.id) {
        return item.key === action.key && item.id === action.data.id;
      }
      return item.key === action.type;
    })),
    map(([ action ]) => zefRemoveError(action.type, action.data?.id))
  ));

  private _onErrorAdd$ = createEffect(() => this._actions$.pipe(
    ofType(zefAddError),
    filter((err) => err.errorType === 'snack'),
    switchMap((data) => this._snackbar
      .openFromComponent(
        SnackErrorComponent,
        { data, duration: 3000, panelClass: 'zef-snack' }
      )
      .onAction()
      .pipe(map(() => zefRemoveError(data.originalAction.type)))
    )
  ));

  constructor(
    private _actions$: Actions<any>,
    private _store: Store<any>,
    private _snackbar: MatSnackBar,
    @Inject(UNIQUE_ERRORS)
    private _uniqueErrors: number[],
    @Inject(BLACKLISTED_ERRORS)
    private _blacklistedErrors: number[]
  ) { }
}
