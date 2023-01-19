import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zef-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.scss' ]
})
export class DialogComponent {

  dialog: MatDialogRef<any>;
  afterClosedSubscription: Subscription;
  afterOpenedSubscription: Subscription;
  onEscKeySubscription: Subscription;

  @Input()
  autoFocus = true;

  @Input()
  options: MatDialogConfig = {};

  @Input()
  backdropClass: string | string[];

  @Input()
  paneClass: string;

  @Output()
  closeTrigger = new EventEmitter<void>();

  @Output()
  afterOpen = new EventEmitter<void>();

  @ViewChild('ref', { static: true })
  templateRef: TemplateRef<any>;

  @Input()
  set open(v: boolean) {
    if (v === true) {
      setTimeout(() => {
        this.dialog = this._dialog.open(this.templateRef, {
          disableClose: true,
          ...this.options,
          autoFocus: this.autoFocus,
          backdropClass: this.backdropClass,
          panelClass: this.paneClass,
          restoreFocus: false
        });

        this.afterClosedSubscription = this.dialog.afterClosed().subscribe(() => {
          console.log('asf');

          this.closeTrigger.emit();
        });

        this.afterOpenedSubscription = this.dialog.afterOpened().subscribe(() => {
          this.afterOpen.emit();
        });

        this.onEscKeySubscription = this.dialog.keydownEvents().subscribe(event => {
          if (event.key === 'Escape') {
            if (this.dialog && (this.options.disableClose === false || !this.options.disableClose)) {
              this._closeDialog();
              this.closeTrigger.emit();
            }
          }
        });
      });
    } else if (this.dialog) {
      this._closeDialog();
    }
  }

  constructor(private _dialog: MatDialog) {}

  close() {
    this.dialog?.close();
  }

  private _closeDialog() {
    this.dialog.close();
    this.afterClosedSubscription.unsubscribe();
    this.afterOpenedSubscription.unsubscribe();
    this.onEscKeySubscription.unsubscribe();
  }

}
