import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardComponent } from './copy-to-clipboard.component';

@NgModule({
  declarations: [ CopyToClipboardComponent ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule
  ],
  exports: [ CopyToClipboardComponent ]
})
export class ZefCopyToClipboardModule {

}
