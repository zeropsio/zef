import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class ZefWebsocketService {

  private _receiverId: string;

  getReceiverId() {
    if (!this._receiverId) { this.generateReceiverId(); }
    return this._receiverId;
  }

  generateReceiverId() {
    this._receiverId = v4();
  }
}
