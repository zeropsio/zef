import {
  transition,
  trigger,
  query,
  style,
  animate,
  group
} from '@angular/animations';

export const outerRouteAnimation = trigger('outerRouteAnimation', [
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
      query(':leave', [
        animate(
          '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 0 }))
      ], { optional: true }),

      // controls / content
      group([
        query(':enter .a-content, :enter .c-content-controls-pane-wrap', [
          style({
            transform: 'translate3d(0, 5px, 0)',
            opacity: 0
          }),
          animate(
            '300ms 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            style({
              transform: 'translate3d(0, 0, 0)',
              opacity: 1
            }))
        ], { optional: true }),

        // content
        query(':enter .c-content-content-pane-wrap', [
          style({
            transform: 'translate3d(0, 5px, 0)',
            opacity: 0
          }),
          animate(
            '300ms 350ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            style({
              transform: 'translate3d(0, 0, 0)',
              opacity: 1
            }))
        ], { optional: true }),

      ])

    ])

  ])
]);
