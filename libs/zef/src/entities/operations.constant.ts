export enum EntityOps {
  AddOne = 'add-one',
  AddOneSuccess = 'add-one/success',
  AddOneError = 'add-one/error',

  UpdateOne = 'update-one',
  UpdateOneSuccess = 'update-one/success',
  UpdateOneError = 'update-one/error',

  GetOne = 'get-one',
  GetOneSuccess = 'get-one/success',
  GetOneError = 'get-one/error',

  GetAll = 'get-all',
  GetAllSuccess = 'get-all/success',
  GetAllError = 'get-all/error',

  SearchAll = 'search-all',
  SearchAllSuccess = 'search-all/success',
  SearchAllError = 'search-all/error',

  Suggest = 'suggest',
  SuggestSuccess = 'suggest/success',
  SuggestError = 'suggest/error',

  Subscribe = 'subscribe',
  SubscribeSuccess = 'subscribe/success',
  SubscribeError = 'subscribe/error',

  UpdateSubscribe = 'update-subscribe',
  UpdateSubscribeSuccess = 'update-subscribe/success',
  UpdateSubscribeError = 'update-subscribe/error',

  ListSubscribe = 'list-subscribe',
  ListSubscribeSuccess = 'list-subscribe/success',
  ListSubscribeError = 'list-subscribe/error',

  DeleteOne = 'delete-one',
  DeleteOneSuccess = 'delete-one/success',
  DeleteOneError = 'delete-one/error',

  RestoreOne = 'restore-one',
  RestoreOneSuccess = 'restore-one/success',
  RestoreOneError = 'restore-one/error',

  AddToCache = 'add-to-cache',
  AddToCacheDone = 'add-to-cache/done',
  AddIdsToCache = 'add-ids-to-cache',

  RemoveFromCache = 'remove-from-cache',
  RemoveFromCacheDone = 'remove-from-cache/done',
  RemoveIdsFromCache = 'remove-ids-from-cache',

  UpdateCache = 'update-cache',
  UpdateCacheDone = 'update-cache/done',

  ListReset = 'list-reset',
  SuggestReset = 'suggest-reset'
}

export const OP_SUCCESS = '/success';

export const OP_ERROR = '/error';

export function makeErrorOp(op: EntityOps | string): EntityOps {
  return <EntityOps>(op + OP_ERROR);
}

export function makeSuccessOp(op: EntityOps | string): EntityOps {
  return <EntityOps>(op + OP_SUCCESS);
}
