import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'nameQuoting',
  pure: true
})
export class NameQuotingPipe implements PipeTransform {
  transform(value: string | undefined) : string | undefined {
    if (value) {
      return value.split(' ').length > 1 ? `"${value}"` : value;
    }
    return value;
  }
}
