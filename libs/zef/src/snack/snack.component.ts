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
import { ZefSnackTemplateService } from './snack-template.service';
import { ZefSnackType } from './snack.model';

@Component({
  selector: 'zef-snack',
  templateUrl: './snack.component.html',
  styleUrls: [ './snack.component.scss' ]
})
export class ZefSnackComponent implements OnInit, OnDestroy {
  tpl: TemplateRef<any>;
  data: { data: any; type: ZefSnackType; };

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    private _data: any,
    public snackRef: MatSnackBarRef<ZefSnackComponent>,
    private _snackTemplates: ZefSnackTemplateService
  ) { }

  ngOnInit() {
    this.data = this._data;
    this.tpl = this._snackTemplates.getTemplate(this.data.type);
  }

  ngOnDestroy() {
    this.close();
  }

  close() {
    if (this.snackRef) {
      this.snackRef.dismiss();
    }
  }
}
