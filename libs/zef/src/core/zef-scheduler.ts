import { Directive, inject, ChangeDetectorRef } from '@angular/core';

import { createRenderScheduler } from './render-scheduler';
import { TickScheduler } from './tick-scheduler.service';

@Directive()
export abstract class ZefScheduler {

  private cdRef = inject(ChangeDetectorRef);
  private tickScheduler = inject(TickScheduler);

  protected readonly renderScheduler = createRenderScheduler({
    cdRef: this.cdRef,
    tickScheduler: this.tickScheduler
  });

}
