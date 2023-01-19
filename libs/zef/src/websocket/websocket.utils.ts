import { filter, map } from 'rxjs/operators';
import { Observable, OperatorFunction } from 'rxjs';
import { zefWebsocketMessage } from './websocket.action';
import { ofType } from '@ngrx/effects';

// TODO: interface
export const onWebsocketSubscriptionName = (name: string): OperatorFunction<any, any> => {
  return (action$: Observable<any>) => action$.pipe(
    ofType(zefWebsocketMessage),
    filter((action: any) => action.message && action.message.subscriptionName === name),
    map((action) => action.message)
  );
};
