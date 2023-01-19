export class ZefProgressState {
  progress: ZefProgress[];

  constructor() {
    this.progress = [];
  }
}

// TODO: interface
export interface ZefProgressConfig {
  foo: string;
}

export interface ZefProgress {
  key: string;
  id?: string | number;
  progress?: number;
  meta?: any;
}

export interface ZefProgressMap {
  [id: string]: {
    [key: string]: ZefProgress;
  };
}
