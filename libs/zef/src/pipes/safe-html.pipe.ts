import {
  PipeTransform,
  Pipe,
  ╔ÁbypassSanitizationTrustHtml
} from '@angular/core';

@Pipe({
  name: 'safeHtml',
  pure: true
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: any) {
    return ╔ÁbypassSanitizationTrustHtml(value);
  }
}
