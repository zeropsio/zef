import isArray from 'lodash-es/isArray';
import { OperatorFunction, Observable, MonoTypeOperatorFunction } from 'rxjs';
import { filter, tap, map, distinctUntilChanged, take } from 'rxjs/operators';
import isEqual from 'lodash-es/isEqual';

export function arrayify<T>(data: any | any[]): T[] {
  return isArray(data) ? data : [ data ];
}

export const firstAvailable = <A extends Observable<any>>() => {
  return (source$: A) => source$.pipe(
    filter((d) => !!d),
    take(1)
  ) as A;
};

export const toBoolDistinct = <T>(): OperatorFunction<T, boolean> => {
  return (input$) => input$.pipe(
    map((s) => !!s),
    distinctUntilChanged()
  );
};

export const anyTrue: OperatorFunction<[ boolean, boolean ], boolean> = map(([ a, b ]) => a || b);

export function log<T>(message?: any): OperatorFunction<T, T> {
  return function(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      tap((e) => {
        if (message) {
          console.log(message, e);
        } else {
          console.log(e);
        }
      })
    );
  };
}

export function removeAtIndex(myArray: any[], indexToRemove: number) {
  return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove + 1));
}

export function chooseWeighted(results: any[], weights: number[]) {
  const num = Math.random();
  let s = 0;
  const lastIndex = weights.length - 1;
  for (let i = 0; i < lastIndex; ++i) {
    s += weights[i];
    if (num < s) {
      return results[i];
    }
  }
  return results[lastIndex];
}

export const distinctUntilNotEqual = (prev: string[], next: string[]) => {
  return !prev?.length || (!!prev?.length && isEqual(prev, next));
};

export const distinctUntilLenghtIncrease = (prev: any[], next: any[]) => {
  return !prev?.length || !(prev?.length < next?.length);
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
* Returns a random integer between min (inclusive) and max (inclusive).
* The value is no lower than min (or the next integer greater than min
* if min isn't an integer) and no greater than max (or the next integer
* lower than max if max isn't an integer).
* Using Math.round() will give you a non-uniform distribution!
*/
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}

const toParams = (query: string) => {
  const q = query.replace(/^\??\//, '');

  return q.split('&').reduce((values: any, param) => {
    const [key, value] = param.split('=');

    values[key] = value;

    return values;
  }, {});
};

const toQuery = (params: any, delimiter = '&') => {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, '');
};

export class AuthPopupWindow {

  id: string;
  url: string;
  options: any;
  window: Window;
  promise: Promise<any>;

  private _iid: number;

  constructor(
    url: string,
    options = { height: 1000, width: 600 },
    id = 'zef-auth-window'
  ) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  static open(url: string, options: any, id: string) {
    const popup = new this(url, options, id);

    popup.open();
    popup.poll();

    return popup;
  }

  open() {
    const { url, id, options } = this;

    this.window = window.open(url, id, toQuery(options, ','));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise<any>((resolve, reject) => {
      this._iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();

            reject(new Error('The popup was closed'));

            return;
          }

          if (
            popup.location.href === this.url ||
            popup.location.pathname === 'blank'
          ) {
            return;
          }

          const params = toParams(popup.location.search.replace(/^\?/, ''));

          resolve(params);

          this.close();
        } catch (error) {
          console.warn('An error has been caught:', error);
        }
      }, 250);
    });
  }

  cancel() {
    if (this._iid) {
      window.clearInterval(this._iid);
      this._iid = null;
    }
  }

  then(...args: any[]) {
    return this.promise.then(...args);
  }

  catch(...args: any[]) {
    return this.promise.then(...args);
  }

}


export function extractBetween(beg: string, end: string) {
  const matcher = new RegExp(`${beg}(.*?)${end}`,'gm');
  const normalise = (str: string) => str.slice(beg.length,end.length*-1);
  return function(str: string) {
    return str.match(matcher).map(normalise);
  };
}

export function filterUntil<T>(predicate: (value: T) => boolean): MonoTypeOperatorFunction<T> {
  return observable => new Observable<T>((observer) => {
    let conditionMet = false;

    return observable.subscribe({
      next: (value) => {
        if (!conditionMet && predicate(value)) {
          conditionMet = true;
        }

        if (conditionMet) {
          observer.next(value);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
}


export function extractRepoData(url: string) {
  if (!url) return undefined;

  let match: any;
  let type: 'GITHUB' | 'GITLAB';
  if (url.includes('github.com')) {
    type = 'GITHUB';
    match = url.match(
      /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
    );
  } else if (url.includes('gitlab.com')) {
    type = 'GITLAB';
    match = url.match(
      /^https?:\/\/(www\.)?gitlab.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
    );
  }

  if (!match || !(match.groups?.owner && match.groups?.name)) {
    return undefined;
  }

  return {
    type,
    owner: match.groups.owner,
    name: match.groups.name
  };
}

export function extractRepoPath(url: string) {
  const data = extractRepoData(url);
  if (!data) {
    return undefined;
  }

  return `${data.owner}/${data.name}`;
}

export function invertColor(hex: any, bw?: any) {
  if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
  }
  let r: any = parseInt(hex.slice(0, 2), 16);
  let g: any = parseInt(hex.slice(2, 4), 16);
  let b: any = parseInt(hex.slice(4, 6), 16);

  if (bw) {
      // https://stackoverflow.com/a/3943023/112731
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
          ? '#000000'
          : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: any, len?: any) {
  len = len || 2;
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
