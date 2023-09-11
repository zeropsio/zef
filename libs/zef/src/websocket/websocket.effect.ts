import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, race, timer } from 'rxjs';
import {
  switchMap,
  catchError,
  map,
  tap,
  debounceTime,
  filter,
  takeUntil,
  concatMap,
  delay,
  take
} from 'rxjs/operators';
import { log } from '../core';
import {
  zefWebsocketAuth,
  zefWebsocketSuccess,
  zefWebsocketFail,
  zefWebsocketMessage,
  zefWebsocketClosed,
  zefWebsocketOpened,
  zefWebsocketTerminate
} from './websocket.action';
import { WebsocketApi } from './websocket.api';
import { PING_PONG_ENABLED, PING_PONG_TIMER } from './websocket.constant';

@Injectable()
export class WebsocketEffect {

  private _onWebsocketAuth$ = this._actions$.pipe(ofType(zefWebsocketAuth));

  private _onAuth$ = createEffect(() => this._onWebsocketAuth$.pipe(
    concatMap((action) => this._api
      .auth$(action.data.token)
      .pipe(
        map(({ webSocketToken }) => zefWebsocketSuccess(
          {
            token: webSocketToken,
            receiverId: action.data.receiverId
          },
          action
        )),
        catchError((err) => of(zefWebsocketFail(err, action)))
      )
    )
  ));

  private _onAuthFail$ = createEffect(() => this._actions$.pipe(
    ofType(zefWebsocketFail),
    log('_onAuthFail$'),
    debounceTime(10000),
    map((action) => action.originalAction)
  ));

  private _onAuthSuccess$ = createEffect(() => this._actions$.pipe(
    ofType(zefWebsocketSuccess),
    tap(({ data: { token, receiverId } }) => this._api.connect(token, receiverId)),
    switchMap(() => this._api.messages$.pipe(
      takeUntil(this._actions$.pipe(ofType(zefWebsocketTerminate))),
      map((message) => zefWebsocketMessage(message)),
      catchError((err) => of(zefWebsocketClosed(err)))
    ))
  ));

  private _onWsOpened$ = createEffect(() => this._actions$.pipe(
    ofType(zefWebsocketMessage),
    filter((action) => action.message?.type === 'SocketSuccess'),
    map(() => zefWebsocketOpened())
  ));

  private _onStartPingPong$ = createEffect(() => this._actions$.pipe(
    // upon connecting to websocket for
    // the first time, start a 5000ms timer
    ofType(zefWebsocketOpened),
    filter(() => this._pingPongEnabled),
    switchMap(() => timer(0, this._pingPongTimer).pipe(
      // on each timer tick, race between
      // a 3000ms timeout and a websocket
      // message that includes 'pong' response
      switchMap(() => race(
        of('timeout').pipe(delay(3000)),
        // empty observable to wrap sync 'send'
        // method and a 'pong' message stream,
        // of which we only want the first result
        of(undefined).pipe(
          tap(() => this._api.send({ type: 'ping' })),
          switchMap(() => this._actions$.pipe(
            ofType(zefWebsocketMessage),
            filter((action) => action.message?.type === 'pong'),
            take(1)
          ))
        )
      )),
      takeUntil(this._actions$.pipe(ofType(zefWebsocketClosed), take(1)))
    )),
    // if 3000 timeout finishes first
    // trigger websocket closed action
    // which in turn will cause new
    // auth, new zefWebsocketOpened
    // and a new timer
    filter((d) => d === 'timeout'),
    map(() => zefWebsocketClosed())
  ))

  constructor(
    private _actions$: Actions,
    private _api: WebsocketApi,
    @Inject(PING_PONG_ENABLED)
    private _pingPongEnabled: boolean,
    @Inject(PING_PONG_TIMER)
    private _pingPongTimer: number
  ) { }
}
