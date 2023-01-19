import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';
import {
  NgrxFormsExtensionsModule,
  ZefFormModule,
  ZefFormFieldModule,
  ZefFormHintsModule,
  ZefFormLabelModule,
  ZefPasswordFieldModule,
  ZefFormElementModule,
  ZefAutocompleteTagModule
} from './modules';
import { FEATURE_NAME, FORMS_REDUCER_TOKEN } from './forms.constant';
import { FormsReducer } from './forms.reducer';

export function formsReducerFactory(
  formsReducer: FormsReducer
): ActionReducer<any> {
  return formsReducer.createReducer();
}

@NgModule({
  imports: [
    StoreModule.forFeature(
      FEATURE_NAME,
      FORMS_REDUCER_TOKEN
    )
  ],
  providers: [
    {
      provide: FORMS_REDUCER_TOKEN,
      deps: [ FormsReducer ],
      useFactory: formsReducerFactory
    }
  ]
})
export class ZefFormsRootModule { }

@NgModule({
  exports: [
    NgrxFormsModule,
    NgrxFormsExtensionsModule,
    ZefFormModule,
    ZefFormFieldModule,
    ZefFormHintsModule,
    ZefFormLabelModule,
    ZefPasswordFieldModule,
    ZefFormElementModule,
    ZefAutocompleteTagModule
  ]
})
export class ZefFormsModule {
  static forRoot(): ModuleWithProviders<ZefFormsRootModule> {
    return {
      ngModule: ZefFormsRootModule
    };
  }
}
