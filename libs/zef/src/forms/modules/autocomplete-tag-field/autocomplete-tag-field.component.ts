import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Directive,
  TemplateRef,
  ContentChild
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl
} from '@angular/forms';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ObservableInput } from 'observable-input';
import { Observable, combineLatest, Subject } from 'rxjs';
import { startWith, map, delay } from 'rxjs/operators';
import isEqual from 'lodash-es/isEqual';
import sortBy from 'lodash-es/sortBy';

@Directive({
  selector: '[zefAutocompleteTagTitle]'
})
export class ZefAutocompleteTagTitleDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

@Component({
  selector: 'zef-autocomplete-tag-field',
  templateUrl: './autocomplete-tag-field.component.html',
  styleUrls: [ './autocomplete-tag-field.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZefAutocompleteTagComponent),
      multi: true
    }
  ]
})
export class ZefAutocompleteTagComponent implements ControlValueAccessor {

  @ObservableInput()
  @Input('tags')
  tags$!: Observable<string[]>;

  @Input()
  label: string;

  @Input()
  tagSearchPlaceholder: string;

  @Input()
  hint: string;

  @Input()
  blacklist: string[];

  @Input()
  showPanel = false;

  @Input()
  disableAutocomplete = false;

  @Input()
  removable = true;

  @Input()
  selectable = false;

  @Input()
  addOnBlur = true;

  @Input()
  separatorKeysCodes = [ ENTER, COMMA, SPACE ];

  @ContentChild(ZefAutocompleteTagTitleDirective, { static: false })
  hintRef: ZefAutocompleteTagTitleDirective;

  @ViewChild('searchInputRef', { static: false })
  searchInputRef: ElementRef<HTMLInputElement>;

  @ViewChild('autocompleteRef', { static: false })
  matAutocomplete: MatAutocomplete;

  @Output()
  optionSelected = new EventEmitter<string>();

  @Output()
  optionAdded = new EventEmitter<string>();

  @Output()
  blacklisted = new EventEmitter<string>();

  searchFormControl = new UntypedFormControl();

  set selectedTags(val: string[]) {
    this._selectedTags = val;
    this._selectedTags$.next(val);
  }

  get selectedTags() {
    return this._selectedTags;
  }

  _selectedTags$ = new Subject<string[]>();

  filteredTags$ = combineLatest([
    this.tags$,
    this.searchFormControl.valueChanges.pipe(
      startWith(<string>undefined),
      delay(0)
    ),
    this._selectedTags$.pipe(
      startWith(<string[]>undefined),
      delay(0)
    )
  ]).pipe(
    map(([ tags, search, selected ]) => (tags || [])
      .filter((tag) => !selected?.includes(tag))
      .filter((tag) => !search || tag?.includes(search))
    )
  );

  private _selectedTags: string[];

  writeValue(val: string[]) {
    if ((!val?.length && !this.selectedTags) || (!isEqual(sortBy(val), sortBy(this.selectedTags)))) {
      this.selectedTags = val;
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(_: any) {
    return ;
  }

  remove(item: string) {
    this.selectedTags = this.selectedTags.filter((val) => val !== item);

    this._propagateChange(this.selectedTags);
  }

  add(item: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {

      const tag = item.value.trim();

      if (!!tag
        && !this.selectedTags?.includes(tag)
        && (!this.blacklist?.length
          || !this.blacklist?.includes(tag))
      ) {
        this.selectedTags = [
          ...this.selectedTags,
          tag
        ].filter((v) => !!v);

        this.optionAdded.emit(tag);

        this._resetSearch();

        this._propagateChange(this.selectedTags);
      }

      if (this.blacklist?.includes(tag)) {
        this._resetSearch();
        this.blacklisted.emit(tag);
      }
    }
  }

  _selected(e: MatAutocompleteSelectedEvent) {
    this.selectedTags = [
      ...this.selectedTags,
      e.option.viewValue
    ];

    this.optionSelected.emit(e.option.viewValue);

    this._propagateChange(this.selectedTags);

    this._resetSearch();
  }

  private _propagateChange = (_: any) => {
    return;
  };

  private _resetSearch() {
    this.searchFormControl.reset();
    this.searchFormControl.setValue(undefined);

    this.searchInputRef.nativeElement.value = '';
  }
}
