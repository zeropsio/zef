import { PipeTransform, Pipe } from '@angular/core';
import { HashMap } from '../core';
import omit from 'lodash-es/omit';

@Pipe({
  name: 'routerParams',
  pure: true
})
export class RouterParamsPipe implements PipeTransform {
  transform(params: HashMap<any>, key: string, value?: string) {
    if (!params || !key) { return undefined; }
    // add
    if (value) {
      return {
        ...params,
        [key]: value
      };
    // remove
    } else {
      return omit(params, key);
    }
  }
}
