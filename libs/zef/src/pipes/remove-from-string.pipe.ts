import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'removeFromString',
  pure: true
})
export class RemoveFromStringPipe implements PipeTransform {
  transform(str: string, item: string, separator?: string) {
    if (!!str) {
      if (item && separator) {

        if (str.includes(separator)) {
          const splitted = str.split(separator);
          if (splitted[splitted.length - 1] === item) {
            return str.replace(`${separator}${item}`, '');
          }
        }

        if (str.includes(`${item}${separator}`)) {
          return str.replace(`${item}${separator}`, '');
        }

        if (str.includes(item) && !str.includes(`${item}${separator}`)) {
          return str.replace(item, '');
        }

      }

      if (item && !separator) {
        return str.replace(item, '');
      }
    }

    return str;
  }
}
