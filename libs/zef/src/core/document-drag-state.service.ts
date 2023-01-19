import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';


function isDragSourceExternalFile(dataTransfer: any) {

  // Source detection for Safari v5.1.7 on Windows.
  if (typeof Clipboard !== undefined) {
    if (dataTransfer.constructor === Clipboard) {
      if ((dataTransfer as any).files.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Source detection for Firefox on Windows.
  if (typeof DOMStringList !== undefined) {
    const DragDataType = dataTransfer.types;
    if (DragDataType.constructor === DOMStringList) {
      if (DragDataType.contains('Files')) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Source detection for Chrome on Windows.
  if (typeof Array !== undefined) {
    const DragDataType = dataTransfer.types;
    if (DragDataType.constructor === Array) {
      if (DragDataType.indexOf('Files') !== -1) {
        return true;
      } else {
        return false;
      }
    }
  }
}

@Injectable({ providedIn: 'root' })
export class DocumentDragStateService {

  isDragging$: Observable<boolean>;

  private _draggingSubject$ = new Subject<boolean>();

  constructor(@Inject(DOCUMENT) private _document: Document) {
    this.isDragging$ = this._draggingSubject$.pipe(
      distinctUntilChanged()
    );

    this._document.addEventListener('dragleave', (e) => {
      if (!e.clientX && !e.clientY) {
        this._draggingSubject$.next(false);
      } else {
        this._draggingSubject$.next(isDragSourceExternalFile(e.dataTransfer));
      }
    });

    this._document.addEventListener('drop', (_) => {
      this._draggingSubject$.next(false);
    });

  }
}
