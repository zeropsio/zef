import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { SatPopover } from '../popover';
import { Sort } from '../../sort.model';

@Component({
  selector: 'zef-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: [ './sort-button.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZefSortButtonComponent {

  @Input()
  anchor: SatPopover;

  @Input()
  activeSort: Sort;

  @Input()
  defaultSort: Sort;

  @Input()
  disabled = false;

  @Output()
  clicked = new EventEmitter<void>();

}
