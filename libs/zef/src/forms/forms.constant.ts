import { InjectionToken } from '@angular/core';
import { ActionReducer } from '@ngrx/store';

export const FEATURE_NAME = '@zerops/zef/forms';
export const FORMS_REDUCER_TOKEN = new InjectionToken<ActionReducer<Map<any, any>>>('zef-forms/reducer');
