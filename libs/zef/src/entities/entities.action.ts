import { createAction } from '@ngrx/store';

export const showMoreEntities = createAction(
  '[@zerops/zef/entities] show-more-entities',
  (key: string) => ({ key })
);
