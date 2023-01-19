import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  pure: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  transform(text: string, search: string): SafeHtml {
    if (search && text) {
      // eslint-disable-next-line no-useless-escape
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

      pattern = pattern.split(' ').filter((t) => {
        return t.length > 0;
      }).join('|');

      const regex = new RegExp(pattern, 'gi');
      return this._sanitizer.bypassSecurityTrustHtml(
        text.replace(regex, (match) => `<mark>${match}</mark>`)
      );

    } else {
      return text;
    }
  }
}
