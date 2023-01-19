import { Directive, TemplateRef, AfterViewInit } from '@angular/core';
import { ZefErrorTemplateService } from '../../error-template.service';

@Directive({
  selector: '[zefPopErrorOutlet]'
})
export class PopErrorOutletDirective implements AfterViewInit {
  constructor(
    public templateRef: TemplateRef<any>,
    private _errorTemplate: ZefErrorTemplateService
  ) { }

  ngAfterViewInit() {
    this._errorTemplate.setTemplate(
      this.templateRef,
      'pop'
    );
  }
}
