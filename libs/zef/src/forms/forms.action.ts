import { createAction, props } from '@ngrx/store';

export const addForm = createAction(
  '[@zerops/zef/forms] add-form',
  props<{ id: string; defaultValues: any; }>()
);
