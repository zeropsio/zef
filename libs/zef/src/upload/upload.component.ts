import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Input,
  ContentChild,
  Directive,
  TemplateRef
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ZefSnackService } from '../snack';
import { ZefUploadTypes, ZefUploadItem } from './upload.model';

export enum AcceptEntensions {
  Image = 'image',
  Video = 'video',
  Gif = 'gif',
  ImageVideo = 'imagevideo',
  Zip = 'zip'
}

@Directive(({
  selector: '[zefUploadDragzone]'
}))
export class ZefUploadDragzoneDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Directive(({
  selector: '[zefUploadButton]'
}))
export class ZefUploadButtonDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Component({
  selector: 'zef-upload',
  templateUrl: './upload.component.html',
  styleUrls: [ './upload.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZefUploadComponent {

  files: ZefUploadItem[] = [];
  isDragover = false;
  private _accept: string;
  private _multiple: boolean;
  private _disable: boolean;
  private _acceptExtensionsMap = {
    [AcceptEntensions.Image]: '.jpg, .jpeg, .png',
    [AcceptEntensions.Video]: 'video/*',
    [AcceptEntensions.Gif]: '.gif',
    [AcceptEntensions.ImageVideo]: '.jpg, .jpeg, .png, video/*',
    [AcceptEntensions.Zip]: 'application/x-zip-compressed, application/zip',
  };

  @Input()
  set multiple(v: string | boolean) {
    this._multiple = coerceBooleanProperty(v);
  }
  get multiple(): boolean {
    return this._multiple;
  }

  @Input()
  set disable(v: string | boolean) {
    this._disable = coerceBooleanProperty(v);
  }
  get disable(): boolean {
    return this._disable;
  }

  @Input()
  imageAcceptExtensions = this._acceptExtensionsMap[AcceptEntensions.Image];

  @Input()
  set accept(val) {
    switch (val) {
      case AcceptEntensions.Image:
        this._accept = this.imageAcceptExtensions;
        break;

      case AcceptEntensions.Video:
        this._accept = this._acceptExtensionsMap[AcceptEntensions.Video];
        break;

      case AcceptEntensions.Gif:
        this._accept = this._acceptExtensionsMap[AcceptEntensions.Gif];
        break;

      case AcceptEntensions.ImageVideo:
        this._accept = this._acceptExtensionsMap[AcceptEntensions.ImageVideo];
        break;

      case AcceptEntensions.Zip:
        this._accept = this._acceptExtensionsMap[AcceptEntensions.Zip];
        break;

      default:
        this._accept = '*';
        break;
    }
  }

  get accept() {
    return this._accept;
  }

  @ViewChild('fileInputRef')
  fileInputRef: ElementRef;

  @ContentChild(ZefUploadButtonDirective)
  uploadButtonRef: ZefUploadButtonDirective;

  @ContentChild(ZefUploadDragzoneDirective)
  uploadDragzoneRef: ZefUploadDragzoneDirective;

  @Output()
  selectTrigger = new EventEmitter<ZefUploadItem[]>(false);

  @Output()
  dragEnter = new EventEmitter<void>();

  @Output()
  dragLeave = new EventEmitter<void>();

  @Output()
  dragDrop = new EventEmitter<void>();

  constructor(private _snack: ZefSnackService) {}

  onClick(e: MouseEvent) {
    e.preventDefault();

    if (!this.disable) {
      this.fileInputRef.nativeElement.click();
    }
  }

  drop(e: DragEvent) {
    e.preventDefault();
    if (!this.disable) {
      if (!e.dataTransfer || !e.dataTransfer.files.length) {
        return;
      }

      // TODO: more system solution for every accept etension type
      if (this.accept === this._acceptExtensionsMap[AcceptEntensions.Zip]) {
        if (Array.from(e.dataTransfer.files).every((file) => file.type === 'application/zip'
          || file.type === 'application/x-zip-compressed')) {
          this._proccessFiles(e.dataTransfer.files);
        } else {
          this._snack.warning$({ text: 'Deploy package needs to be in ZIP format.' });
        }
      } else {
        this._proccessFiles(e.dataTransfer.files);
      }
    }
  }

  dragenter(e: DragEvent) {
    e.preventDefault();
    this.dragEnter.emit();
    this.isDragover = true;
  }

  dragover(e: DragEvent) {
    e.preventDefault();

    this.isDragover = true;
  }

  dragleave(e: DragEvent) {
    e.preventDefault();
    this.dragLeave.emit();
    this.isDragover = false;
  }

  onFileChange(el: any) {
    this._proccessFiles(el.target.files);
  }

  private _proccessFiles(files: any) {
    const that = this;

    const promises: Promise<any>[] = [];

    for (let index = 0; index < files.length; index++) {
      const file: File = files[index];

      const promise = new Promise<void>((resolve) => {
        const data = {
          dataUrl: URL.createObjectURL(file),
          type: this._getType(file),
          meta: file,
          height: undefined,
          width: undefined,
          thumbnails: []
        };

        if (data.type === 'image') {
          const i = new Image();

          i.onload = () => {
            data.height = i.height;
            data.width = i.width;

            that.files.push(data);
            resolve();
          };

          i.src = data.dataUrl;
        } else if (data.type === 'video') {
          const v = document.createElement('video');
          v.addEventListener('loadedmetadata', function() {
            data.width = this.videoWidth;
            data.height = this.videoHeight;

            that.files.push(data);

            resolve();
          });

          v.src = data.dataUrl;

        } else {
          that.files.push(data);
          resolve();
        }
      });

      promises.push(promise);

    }

    Promise.all(promises).then(() => {
      this.selectTrigger.emit(this.files);

      this.files = [];

      this.fileInputRef.nativeElement.value = '';

    });

  }

  private _getType(file: File): ZefUploadTypes {
    if (file.type === 'image/gif')  {
      return 'gif';
    }

    const typeBeforeSlash = file.type.substr(0, file.type.indexOf('/'));
    if (typeBeforeSlash === 'video') {
      return 'video';
    }

    if (typeBeforeSlash === 'image') {
      return 'image';
    }

    return 'file';
  }

}
