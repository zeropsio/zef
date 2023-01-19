import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ZefPaginatorComponent } from './paginator.component';

@NgModule({
  declarations: [ ZefPaginatorComponent ],
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  exports: [ ZefPaginatorComponent ]
})
export class ZefPaginatorModule { }
