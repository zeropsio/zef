import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ZefSnackService } from '../snack';

@Component({
  selector: 'zef-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: [ './copy-to-clipboard.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyToClipboardComponent {
  @Input()
  copyData: string;

  @Input()
  tooltip: string;

  @Input()
  mode: 'basic' | 'icon' = 'icon';

  constructor(
    private _clipboardService: Clipboard,
    private _snack: ZefSnackService
  ) {}

  copy() {
    this._clipboardService.copy(this.copyData);
    this._snack.info$({ translation: 'general.copySuccess' }, { duration: 800 });
  }
}
