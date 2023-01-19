import { Component, ViewEncapsulation, TemplateRef, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectZefErrorByErrorType } from '../../errors.selector';
import { ZefErrorTemplateService } from '../../error-template.service';

@Component({
  selector: 'zef-dialog-error',
  templateUrl: './dialog-error.container.html',
  styleUrls: [ './dialog-error.container.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DialogErrorContainer implements OnInit {
  tpl: TemplateRef<any>;
  dialogErrors$ = this._store.pipe(
    select(selectZefErrorByErrorType('dialog'))
  );
  dialogErrorsDelayed$ = this.dialogErrors$.pipe(
    // TODO: reenable -> figure out why errors disappear
    // delayWhen((d) => d && d.length ? timer(0) : timer(400))
  );
  isOpen$ = this.dialogErrors$.pipe(
    map((v) => !!v.length)
  );

  constructor(
    private _store: Store<any>,
    private _errorTemplate: ZefErrorTemplateService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.tpl = this._errorTemplate.getTemplate('dialog');
    });
  }
}
