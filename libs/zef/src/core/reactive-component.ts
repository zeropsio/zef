import { Directive } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { ZefAppInjector } from './app-injector';
import { ZefTranslationsService } from '../translations';
import { HashMap } from './models';
import { ZefReactiveComponentBase } from './reactive-component-base';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class ZefReactiveComponent extends ZefReactiveComponentBase {

  private __store = ZefAppInjector.injector.get(Store);
  private __translationsService = ZefAppInjector.injector.get(ZefTranslationsService);

  constructor() {
    super();
  }

  translate$<T>(key: string, params?: HashMap<any>) {
    return this.__translationsService.selectTranslate$<T>(key, params);
  }

  $dispatchActions(actions: Observable<Action>[]) {
    merge(...actions)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.__store);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['key'];
  }

}
