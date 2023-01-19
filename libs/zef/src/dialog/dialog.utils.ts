import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { zefDialogOpen, zefDialogClose } from './dialog.action';
import { ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';

export const onZefDialogOpen = (k: string) => {
  return (source$: Observable<Action>) => source$.pipe(
    ofType(zefDialogOpen),
    filter(({ key }) => key === k)
  );
};

export const onZefDialogClose = (k: string) => {
  return (source$: Observable<Action>) => source$.pipe(
    ofType(zefDialogClose),
    filter(({ key }) => key === k)
  );
};
