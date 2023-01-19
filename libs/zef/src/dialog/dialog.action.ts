import { createAction, union } from '@ngrx/store';
import { DialogPayload } from './dialog.model';

export const zefDialogOpen = createAction(
  '[@zerops/zef/dialog] open',
  ({ key, meta }: DialogPayload) => ({ key, meta })
);
export const zefDialogClose = createAction(
  '[@zerops/zef/dialog] close',
  ({ key, meta }: DialogPayload) => ({ key, meta })
);
export const zefDialogToggle = createAction(
  '[@zerops/zef/dialog] toggle',
  ({ key, meta }: DialogPayload) => ({ key, meta })
);

const all = union({ open: zefDialogOpen, close: zefDialogClose, toggle: zefDialogToggle });
export type DialogActionUnion = typeof all;
