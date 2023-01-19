import { Pipe, PipeTransform } from '@angular/core';
import sumBy from 'lodash-es/sumBy';
import isArray from 'lodash-es/isArray';

@Pipe({
  name: 'sumBy',
  pure: true
})
export class SumByPipe implements PipeTransform {
  transform(input: any, key: string): any {
    return !isArray(input) ? 0 : sumBy(input, key);
  }
}
