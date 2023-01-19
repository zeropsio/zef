import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ButtonProgressComponent } from './button-progress.component';
import { ZefFadeAnimationModule } from '../../../animations';

@NgModule({
  declarations: [ ButtonProgressComponent ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    ZefFadeAnimationModule
  ],
  exports: [ ButtonProgressComponent ]
})
export class ButtonProgressModule {

}
