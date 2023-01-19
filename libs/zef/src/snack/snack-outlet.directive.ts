import { Directive, TemplateRef, AfterViewInit, Input } from '@angular/core';
import { ZefSnackTemplateService } from './snack-template.service';
import { ZefSnackType } from './snack.model';

@Directive({
  selector: '[zefSnackOutlet]'
})
export class ZefSnackOutletDirective implements AfterViewInit {

  @Input()
  zefSnackOutletType: ZefSnackType;

  constructor(
    public templateRef: TemplateRef<any>,
    private _snackTemplate: ZefSnackTemplateService
  ) { }

  ngAfterViewInit() {
    this._snackTemplate.setTemplate(
      this.templateRef,
      this.zefSnackOutletType
    );
  }
}
