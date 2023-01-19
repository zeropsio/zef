import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SatPopoverModule } from '../popover';
import { ZuiMaterialStackModule } from '@zerops/zui/material-stack';
import { ZefSortCardModule } from './modules';
import { ZefSortButtonModule } from './modules';
import { ZefSortComponent } from './sort.component';

@NgModule({
  declarations: [ ZefSortComponent ],
  imports: [
    CommonModule,
    ZuiMaterialStackModule,
    SatPopoverModule,
    ZefSortCardModule,
    ZefSortButtonModule
  ],
  exports: [ ZefSortComponent ]
})
export class ZefSortModule { }
