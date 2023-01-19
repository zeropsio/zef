import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { HashMap, ZefReactiveComponentBase } from '../core';
import { selectZefNgrxRouterParams } from '../ngrx-router';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ObservableInput } from 'observable-input';
import { getNameWithKey, Direction } from '../../sort.utils';
import { Sort, SortItem } from '../../sort.model';

@Component({
  selector: 'zef-sort-card',
  templateUrl: './sort-card.container.html',
  styleUrls: [ './sort-card.container.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZefSortCardContainer extends ZefReactiveComponentBase {

  activeSortChange$ = new Subject<Sort>();

  @Input()
  sorts: SortItem[];

  @Input()
  key = '';

  @ObservableInput()
  @Input('activeSort')
  activeSort$!: Observable<Sort>;

  @Input()
  defaultSort: Sort;

  params$ = this._store.pipe(select(selectZefNgrxRouterParams));

  // # State resolver
  state = this.$connect({
    activeSort: this.activeSort$
  });

  constructor(
    private _store: Store<any>,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    super();

    this.activeSortChange$.pipe(
      takeUntil(this.onDestroy$),
      withLatestFrom(this.params$, this.activeSort$)
    ).subscribe(([ changedSort, queryParams, activeSort ]) => {
        let sort: Direction;

        // TODO: comment reason for all nested ifs
        if (activeSort?.key) {
          sort = activeSort.key === changedSort.key
            ? (changedSort.direction
              ? changedSort.direction
                : activeSort.direction === 'asc'
                  ? 'desc'
                  : 'asc'
              )
            : (changedSort.direction
                ? changedSort.direction
                : 'asc'
              );
        } else if (!activeSort?.key && this.defaultSort.key) {
          sort = changedSort.direction
            ? changedSort.direction
            : this.defaultSort.direction === 'asc'
              ? 'desc'
              : 'asc';
        }

        this._navigate(queryParams, changedSort.key, sort);

      });

  }

  private _navigate(params: HashMap<any>, key: string, sort: 'asc' | 'desc') {
    this._router.navigate(
      [{
        ...params,
        [getNameWithKey(this.key, 'sort')]: key,
        [getNameWithKey(this.key, 'dir')]: sort
      }],
      {
        relativeTo: this._activatedRoute
      }
    );
  }

}
