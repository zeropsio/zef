import {
  Component,
  Inject,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import { ZefErrorTemplateService } from '../../error-template.service';

@Component({
  selector: 'zef-snack-error',
  templateUrl: './snack-error.component.html',
  styleUrls: [ './snack-error.component.scss' ]
})
export class SnackErrorComponent implements OnInit, OnDestroy {
  tpl: TemplateRef<any>;
  data: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    private _data: any,
    public snackRef: MatSnackBarRef<SnackErrorComponent>,
    private _errorTemplates: ZefErrorTemplateService
  ) { }

  ngOnInit() {
    this.data = this._data;
    this.tpl = this._errorTemplates.getTemplate('snack');
  }

  ngOnDestroy() {
    this.close();
  }

  close() {
    if (this.snackRef) {
      this.snackRef.dismissWithAction();
    }
  }
}
