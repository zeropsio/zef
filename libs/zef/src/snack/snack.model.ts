export type ZefSnackType = 'success' | 'warning' | 'info';

export interface Options {
  duration?: number;
  panelClass?: string;
}

export interface ZefSnackInput {
  text?: string;
  translation?: string;
  actionButtonTranslation?: string;
  actionButtonText?: string;
}
