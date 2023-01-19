import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

function ansiWordBound(c) {
  return (
    (' ' === c) ||
    ('\n' === c) ||
    ('\r' === c) ||
    ('\t' === c)
  );
}
@Component({
  selector: 'zef-reading-time',
  templateUrl: './reading-time.component.html',
  styleUrls: [ './reading-time.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingTimeComponent {
  @Input()
  set text(text: string) {
    this.time = this._getTextLen(text);
  }

  @Input()
  label: string;

  time: number;

  private _options = {
    wordsPerMinute: 200,
    wordBound: ansiWordBound
  };

  private _getTextLen(text: string) {
    let start = 0;
    let words = 0;
    let end = text.length - 1;
    let i;

    // fetch bounds
    while (this._options.wordBound(text[start])) {
      start++;
    }
    while (this._options.wordBound(text[end])) {
      end--;
    }

    // calculate the number of words
    /* eslint-disable no-empty */
    for (i = start; i <= end;) {
      for (; i <= end && !this._options.wordBound(text[i]); i++) { }
      words++;
      for (; i <= end && this._options.wordBound(text[i]); i++) { }
    }
    /* eslint-enable no-empty */

    // reading time stats
    const minutes = words / this._options.wordsPerMinute;
    // const time = minutes * 60 * 1000;
    const displayed = Math.ceil(parseFloat(minutes.toFixed(2)));

    return displayed;
  }
}
