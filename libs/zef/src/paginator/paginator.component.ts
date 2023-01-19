import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { HashMap } from '../core';

@Component({
  selector: 'zef-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: [ './paginator.component.scss' ]
})
export class ZefPaginatorComponent {

  @Input()
  itemsCount: number;

  @Input()
  pageSize: number;

  @Input()
  routerParams: HashMap<any>;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  setPage(page: PageEvent) {
    this._router.navigate(
      [{
        ...this.routerParams,
        ['page']: page.pageIndex + 1
      }],
      { relativeTo: this._activatedRoute }
    );
  }

}
