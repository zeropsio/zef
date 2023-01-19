import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { ZefAutocompleteTagComponent, ZefAutocompleteTagTitleDirective } from './autocomplete-tag-field.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ZefFormFieldModule } from '../form-field';

@NgModule({
  declarations: [
    ZefAutocompleteTagComponent,
    ZefAutocompleteTagTitleDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ZefFormFieldModule
  ],
  exports: [
    ZefAutocompleteTagComponent,
    ZefAutocompleteTagTitleDirective
  ]
})
export class ZefAutocompleteTagModule {

}
