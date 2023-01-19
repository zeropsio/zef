export class DialogState {
  keys: {
    [key: string]: {
      state: boolean;
      meta?: any;
    };
  };

  constructor() {
    this.keys = {};
  }
}

export interface DialogPayload {
  key: string;
  meta?: any;
}
