import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'middleEllipsis',
  pure: true
})
export class MiddleEllipsisPipe implements PipeTransform {
  transform(str: string, length: number) {
    if (str?.length > length) {
      return str.substr(0, (length / 2)) + '...' + str.substr(str.length - (length / 2), str.length);
    }
    return str;
  }
}
