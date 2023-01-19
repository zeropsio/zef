import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgrxFormsExtensionsModule } from '../ngrx-forms-extensions';
import { ZefFormFieldModule } from '../form-field';
import { ZefFormElementModule } from '../form-element';
import { ZefPasswordFieldComponent } from './password-field.component';

@NgModule({
  declarations: [ ZefPasswordFieldComponent ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgrxFormsModule,
    NgrxFormsExtensionsModule,
    ZefFormFieldModule,
    ZefFormElementModule
  ],
  exports: [ ZefPasswordFieldComponent ]
})
export class ZefPasswordFieldModule {

}
