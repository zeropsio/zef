import {
  transition,
  trigger,
  style,
  animate
} from '@angular/animations';

export const fadeInAnimation = trigger(
  'fadeInAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate(
          '250ms ease-out',
          style({ opacity: 1 })
        )
      ]
    )
  ]
);
