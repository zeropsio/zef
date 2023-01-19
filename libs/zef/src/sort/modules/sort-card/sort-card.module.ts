import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZuiMaterialStackModule } from '@zerops/zui/material-stack';
import { ZefSortCardContainer } from './sort-card.container';

@NgModule({
  declarations: [ ZefSortCardContainer ],
  imports: [
    CommonModule,
    ZuiMaterialStackModule
  ],
  exports: [ ZefSortCardContainer ]
})
export class ZefSortCardModule {

}
