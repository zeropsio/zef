import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'toNumber',
  pure: true
})
export class ToNumberPipe implements PipeTransform {
  transform(data: string) {
    return parseFloat(data);
  }
}
