import { NgModule } from '@angular/core';
import { CustomErrorStateMatcherDirective } from './error-state-matcher';
import { MatListOptionFixDirective } from './mat-list-option-fix';
import { NgrxMatSelectViewAdapter } from './mat-select-view-adapter';

@NgModule({
  declarations: [
    CustomErrorStateMatcherDirective,
    MatListOptionFixDirective,
    NgrxMatSelectViewAdapter
  ],
  exports: [
    NgrxMatSelectViewAdapter,
    CustomErrorStateMatcherDirective,
    MatListOptionFixDirective
  ]
})
export class NgrxFormsExtensionsModule {

}
