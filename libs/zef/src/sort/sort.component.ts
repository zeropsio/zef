import { Component, Input, OnChanges } from '@angular/core';
import { Sort, SortItem } from './sort.model';

@Component({
  selector: 'zef-sort',
  templateUrl: './sort.component.html',
  styleUrls: [ './sort.component.scss' ]
})
export class ZefSortComponent implements OnChanges {

  @Input()
  key = '';

  @Input()
  defaultSort: Sort;

  @Input()
  sorts: SortItem[];

  @Input()
  buttonDisabled = false;

  @Input()
  activeSort: Sort;

  defaultSortWithLabel: Sort;
  activeSortWithLabel: Sort;

  ngOnChanges() {
    // fill in label from sort options
    // so the default sorts doesn't have to
    // pass in translated label
    if (this.sorts?.length) {

      if (this.defaultSort) {
        const sort = this.sorts.find((s) => s.key === this.defaultSort.key);
        this.defaultSortWithLabel = {
          ...this.defaultSort,
          label: sort?.label
        };
      }

      if (this.activeSort) {
        const sort = this.sorts.find((s) => s.key === this.activeSort.key);
        this.activeSortWithLabel = {
          ...this.activeSort,
          label: sort?.label
        };
      }
    }
  }
}
