import { Pipe, PipeTransform } from '@angular/core';

const countDecimals = function (value: number) {
  if(Math.floor(value) === value) return 0;
  return value.toString().split('.')[1].length || 0;
};

const round = (x: number, n: number) => Number((Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n));

@Pipe({
  name: 'decimals',
  pure: true
})
export class DecimalsPipe implements PipeTransform {
  transform(number: number, decimalCount = 2, minDecimalCount?: number): string {
    if (number === undefined) { return undefined; }
    const decCount = countDecimals(round(number, decimalCount));
    if (decCount <= decimalCount) {
      if (decCount) {
        return number.toFixed(minDecimalCount ? minDecimalCount : decCount).toString().split('.')[1];
      } else {
        return number.toFixed(minDecimalCount ? minDecimalCount : 2).toString().split('.')[1];
      }
    } else {
      return number.toFixed(minDecimalCount ? minDecimalCount : decimalCount).toString().split('.')[1];
    }
  }
}
