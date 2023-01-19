import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ZefFormsManagerService {
  private _formsData = [];

  add(data: { id: string; defaultValues: any; updateFns: any }) {
    this._formsData.push(data);
  }

  get(id: string) {
    return this._formsData.find((item) => item.id === id);
  }

  all() {
    return this._formsData;
  }
}
