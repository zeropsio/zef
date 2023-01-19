import { NgModule } from '@angular/core';
import {
  ZefUploadComponent,
  ZefUploadDragzoneDirective,
  ZefUploadButtonDirective
} from './upload.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ZefUploadComponent,
    ZefUploadDragzoneDirective,
    ZefUploadButtonDirective
  ],
  imports: [ CommonModule ],
  exports: [
    ZefUploadComponent,
    ZefUploadDragzoneDirective,
    ZefUploadButtonDirective
  ]
})
export class ZefUploadModule {
}
