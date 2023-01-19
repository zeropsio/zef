import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZuiMaterialStackModule } from '@zerops/zui/material-stack';
import { DynamicPopAnchorModule } from '@zerops/zui/dynamic-pop-anchor';
import { ZefSortButtonComponent } from './sort-button.component';

@NgModule({
  declarations: [ ZefSortButtonComponent ],
  imports: [
    CommonModule,
    ZuiMaterialStackModule,
    DynamicPopAnchorModule
  ],
  exports: [ ZefSortButtonComponent ]
})
export class ZefSortButtonModule {

}
