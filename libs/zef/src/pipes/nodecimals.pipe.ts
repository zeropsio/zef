import { Pipe, PipeTransform } from '@angular/core';

function truncNum(number: number, digits = 0)  {
  return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

@Pipe({
  name: 'noDecimals',
  pure: true
})
export class NoDecimalsPipe implements PipeTransform {
  transform(number: number): number {

    if (number === undefined) { return undefined; }

    return truncNum(number);

  }
}
