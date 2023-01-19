import { Injectable, TemplateRef } from '@angular/core';
import { ZefErrorHandlerType } from './errors.model';

@Injectable({ providedIn: 'root' })
export class ZefErrorTemplateService {
  private _templates: Partial<{
    [key in ZefErrorHandlerType]: TemplateRef<any>;
  }> = {};

  setTemplate(
    tpl: TemplateRef<any>,
    type: ZefErrorHandlerType
  ) {
    this._templates[type] = tpl;
  }

  getTemplate(type: ZefErrorHandlerType) {
    return this._templates[type];
  }
}
