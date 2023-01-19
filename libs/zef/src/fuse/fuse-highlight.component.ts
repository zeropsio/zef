import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import set from 'lodash-es/set';

@Component({
  selector: 'zef-fuse-highlight',
  templateUrl: './fuse-highlight.component.html',
  styleUrls: [ './fuse-highlight.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseHighlightComponent implements OnChanges {
  @Input()
  highlightClass = 'zef-fuse-highlight';

  @Input()
  key: string;

  @Input()
  matches: any;

  @Input()
  data: any;

  text: any;

  ngOnChanges() {
    if (this.matches) {
      const _item = { ...this.data };
      this.matches.forEach((match: any) => {
        set(_item, match.key, this._generateHighlightedText(match.value, match.indices));
      });
      this.text = _item[this.key];
    } else {
      this.text = this.data[this.key];
    }
  }

  private _generateHighlightedText = (inputText: string, regions: number[] = []) => {
    let content = '';
    let nextUnhighlightedRegionStartingIndex = 0;

    regions.forEach((region) => {
      const lastRegionNextIndex = region[1] + 1;

      content += [
        `<span class="__highlight">${inputText.substring(nextUnhighlightedRegionStartingIndex, region[0])}</span>`,
        `<span class="__highlight  __highlight--active  ${this.highlightClass}">`,
        inputText.substring(region[0], lastRegionNextIndex),
        '</span>',
      ].join('');

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
    });

    content += inputText.substring(nextUnhighlightedRegionStartingIndex);

    return content;
  }

}
