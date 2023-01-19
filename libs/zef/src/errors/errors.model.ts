import { HttpErrorResponse } from '@angular/common/http';

export class ZefErrorsState {
  errors: ZefError[];

  constructor() {
    this.errors = [];
  }
}

export type ZefErrorHandlerType = 'pop' | 'snack' | 'dialog' | 'noop';

export interface ZefErrorRootConfig {
  blacklistedErrors?: number[];
  uniqueErrors?: number[];
}

export interface ZefErrorConfig {
  type: ZefErrorHandlerType;
}

export interface ZefError {
  key: any;
  code: any;
  message: any;
  originalError: HttpErrorResponse;
  id?: string | number;
  errorType?: ZefErrorHandlerType;
  originalAction?: any;
}

export interface ZefHttpErrorResponse {
  code: any;
  message: string;
  status: number;
  originalError: HttpErrorResponse;
}
