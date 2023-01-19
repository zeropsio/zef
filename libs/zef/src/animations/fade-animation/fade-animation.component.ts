
import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'zef-fade-animation',
  templateUrl: './fade-animation.component.html',
  styleUrls: ['./fade-animation.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(
        ':leave',
        [
          animate(`{{ leaveDuration }} {{ easing }}`, style({
            opacity: 0
          }))
        ],
        {
          params: {
            duration: '300ms',
            easing: 'linear'
          }
        }
      ),
      transition(
        ':enter',
        [
          style({
            opacity: 0
          }),
          animate(`{{ enterDuration }} {{ easing }}`, style({
            opacity: 1
          }))
        ],
        {
          params: {
            enterDuration: '300ms',
            leaveDuration: '300ms',
            easing: 'linear'
          }
        }
      )
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FadeAnimationComponent {
  @Input()
  animationState: boolean;

  @Input()
  animationParams: {
    duration?: string;
    enterDuration?: string;
    leaveDuration?: string;
    easing?: string;
  };
}
