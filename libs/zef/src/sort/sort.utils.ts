import { map } from 'rxjs/operators';
import { Sort } from './sort.model';

export type Direction = 'asc' | 'desc';

export function getNameWithKey(key: string, name: string) {
  if (!!key) { return `${key}-${name}`; }
  return name;
}

export function getLabelsForKeys(translations: Record<string, unknown>, keys: string[]) {
  return keys.map((key) =>({ key, label: translations[key] }));
}

export function pluckSortParams(key?: string) {
  return map(({ sort, dir }): Sort => ({
    key: getNameWithKey(key, sort),
    direction: getNameWithKey(key, dir) as Direction
  }));
}
