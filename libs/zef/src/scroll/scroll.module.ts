import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZefScrollComponent } from './scroll.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ObserversModule } from '@angular/cdk/observers';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ ZefScrollComponent ],
  imports: [
    CommonModule,
    ScrollingModule,
    ObserversModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [ ZefScrollComponent ]
})
export class ZefScrollModule {

}
