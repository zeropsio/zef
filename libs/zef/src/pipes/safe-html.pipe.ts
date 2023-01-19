import {
  PipeTransform,
  Pipe,
  ɵbypassSanitizationTrustHtml
} from '@angular/core';

@Pipe({
  name: 'safeHtml',
  pure: true
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: any) {
    return ɵbypassSanitizationTrustHtml(value);
  }
}
