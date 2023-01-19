import { Injectable, TemplateRef } from '@angular/core';
import { ZefSnackType } from './snack.model';

@Injectable({ providedIn: 'root' })
export class ZefSnackTemplateService {
  private _templates: Partial<{
    [key in ZefSnackType]: TemplateRef<any>;
  }> = {};

  setTemplate(
    tpl: TemplateRef<any>,
    type: ZefSnackType
  ) {
    this._templates[type] = tpl;
  }

  getTemplate(type: ZefSnackType) {
    return this._templates[type];
  }
}
