import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import {
  LOGIN_URL,
  HOST,
  API_URL,
  FORCE_SECURED_ENDPOINT,
} from './websocket.constant';

@Injectable({ providedIn: 'root' })
export class WebsocketApi {
  messages$: Observable<any>;

  private _subject$: WebSocketSubject<any>;

  constructor(
    private _http: HttpClient,
    @Inject(LOGIN_URL)
    private _loginUrl: string,
    @Inject(HOST)
    private _host: string,
    @Inject(API_URL)
    private _apiUrl: string,
    @Inject(FORCE_SECURED_ENDPOINT)
    private _forceSecuredEndpoint: boolean
  ) { }

  connect(token: string, receiverId: string) {
    this._subject$ = webSocket(this._getConnectEndpoint(token, receiverId));
    this.messages$ = this._subject$.asObservable();
  }

  send(message: any) {
    this._subject$.next(message);
  }

  auth$(accessToken: string) {
    return this._http.post<{ webSocketToken: string; }>(
      this._loginUrl,
      { accessToken }
    );
  }

  private _getConnectEndpoint(token: string, receiverId: string) {
    let protocol = window.location.protocol === 'https:'
      ? 'wss'
      : 'ws';

    if (this._forceSecuredEndpoint) {
      protocol = 'wss';
    }

    let host = this._host;
    if (!host) {
      host = window.location.hostname;
    }

    const receiverTokenPath = !!receiverId && !!token
      ? `/${receiverId}/${token}`
      : `/${receiverId}`;

    return `${protocol}://${host}${this._apiUrl ? `/${this._apiUrl}` : '/api/rest/public/web-socket'}${receiverTokenPath}`;
  }
}
