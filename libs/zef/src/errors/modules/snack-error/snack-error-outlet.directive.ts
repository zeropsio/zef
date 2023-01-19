import { Directive, TemplateRef, AfterViewInit } from '@angular/core';
import { ZefErrorTemplateService } from '../../error-template.service';

@Directive({
  selector: '[zefSnackErrorOutlet]'
})
export class SnackErrorOutletDirective implements AfterViewInit {
  constructor(
    public templateRef: TemplateRef<any>,
    private _errorTemplate: ZefErrorTemplateService
  ) { }

  ngAfterViewInit() {
    this._errorTemplate.setTemplate(
      this.templateRef,
      'snack'
    );
  }
}
