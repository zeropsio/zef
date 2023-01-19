import { PipeTransform, Pipe } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Pipe({
  name: 'zefRouteKey',
  pure: true
})
export class RouteKeyPipe implements PipeTransform {
  transform(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['key']
      ? outlet.activatedRouteData['key']
      : 'void';
  }
}
