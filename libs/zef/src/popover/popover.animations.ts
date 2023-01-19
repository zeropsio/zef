import {
  trigger,
  style,
  animate,
  transition,
  AnimationTriggerMetadata
} from '@angular/animations';

export const transformPopover: AnimationTriggerMetadata = trigger('transformPopover', [
  transition(':enter', [
    style({opacity: 0, transform: 'translate3d(0, 2px, 0)'}),
    animate('{{openTransition}}',
      style({opacity: 1, transform: 'translate3d(0, 0, 0)'}))
  ]),
  transition(':leave', [
    animate('{{closeTransition}}',
      style({opacity: 0, transform: 'translate3d(0, 4px, 0)'}))
  ])
]);
