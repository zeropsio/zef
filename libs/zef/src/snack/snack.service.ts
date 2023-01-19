import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZefSnackComponent } from './snack.component';
import { Options, ZefSnackType, ZefSnackInput } from './snack.model';

@Injectable({
  providedIn: 'root'
})
export class ZefSnackService {
  constructor(private _snack: MatSnackBar) { }

  success$(data: ZefSnackInput, options?: Options) {
    return this._openSnackFromComponent('success', data, options);
  }

  warning$(data: ZefSnackInput, options?: Options) {
    return this._openSnackFromComponent('warning', data, options);
  }

  info$(data: ZefSnackInput, options?: Options) {
    return this._openSnackFromComponent('info', data, options);
  }

  open(message: string, action?: string, _?: Options) {
    return this._snack.open(
      message,
      action,
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    );
  }

  private _openSnackFromComponent(type: ZefSnackType, data: ZefSnackInput, options?: Options ) {
    return this._snack.openFromComponent(
      ZefSnackComponent,
      {
        data: { data, type },
        duration: options ? options.duration : 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:  options && options.panelClass ? 'zef-snack ' +  options.panelClass : 'zef-snack'
      }
    )
    .onAction();
  }

}
