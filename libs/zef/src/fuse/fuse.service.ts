import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';

interface FuseInstance<T> {
  item: T;
  matches?: any;
}

type Keys = Array<
  string
  | Array<string>
  | {
    name: string | Array<string>;
    weight: number;
  }
>;

@Injectable({ providedIn: 'root' })
export class ZefFuseService<T> {
  private _instances: {
    [key: string]: Fuse<FuseInstance<T>>;
  } = {};

  search(
    d: T[],
    keyword: string,
    keys: Keys,
    id: string
  ) {
    if (!keyword) { return d.map((item) => ({ item, matches: [] })); }

    if (!this._instances[id]) { this._instances[id] = this._getInstance(d, keys); }

    return this._instances[id].search(keyword);
  }

  private _getInstance(data: T[], keys: Keys) {
    return new Fuse<FuseInstance<T>>(data as any, {
      keys,
      includeMatches: true
    });
  }

  refresh(
    d: T[],
    keys: Keys,
    id: string
  ) {
    this._instances[id] = this._getInstance(d, keys);
  }
}
