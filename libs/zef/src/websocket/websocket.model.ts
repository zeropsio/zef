export class ZefWebsocketState {
  reconnecting: boolean;
  token: string;
  receiverId: string;

  constructor() {
    this.reconnecting = false;
    this.token = undefined;
    this.receiverId = undefined;
  }
}

export interface WebsocketConfig {
  loginUrl: string;
  host: string;
  apiUrl?: string;
  forceSecuredEndpoint?: boolean;
  tokenNormalizerFn?: (s: any) => { webSocketToken: string; };
  websocketPathNormalizer?: (s: { token?: string; receiverId?: string; }) => string;
  pingPongEnabled?: boolean;
  pingPongTimer?: number;
}
