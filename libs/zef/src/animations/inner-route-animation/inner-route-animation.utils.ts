import {
  transition,
  trigger,
  query,
  style,
  animate,
  group
} from '@angular/animations';

export const innerRouteAnimation = trigger('innerRouteAnimation', [
  transition('* => *', [

    query(':enter, :leave',
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
      }),
      { optional: true }
    ),

    group([

      query(':enter',[
        style({
          transform: 'translate3d(0, 3px, 0)',
          opacity: 0
        }),
        animate(
          '250ms 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          }))
      ], { optional: true }),

      query(':leave', [
        animate(
          '250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({
            // transform: 'translate3d(5px, 0, 0)',
            opacity: 0
          }))
      ], { optional: true })

    ])

  ])
]);
