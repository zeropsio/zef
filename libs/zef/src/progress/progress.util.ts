import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const toProgressMapKey = (key: string): OperatorFunction<any, boolean> => map((m) => !!m[key]);
