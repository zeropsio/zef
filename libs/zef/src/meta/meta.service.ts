import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaConfig, MetaPayload } from './meta.model';
import { META_CONFIG } from './meta.constant';
import { arrayify } from '../core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class MetaService {
  constructor(
    private _title: Title,
    private _meta: Meta,
    @Inject(META_CONFIG)
    private _config: MetaConfig,
    @Inject(DOCUMENT)
    private _document: any
  ) { }

  set(meta: MetaPayload) {
    let fullTitle: string;

    if (meta?.title) {
      fullTitle = this._getTitle(meta.title);
    } else {
      fullTitle = this._config.baseTitle;
    }

    if (meta?.title !== undefined) {
      this._title.setTitle(fullTitle);
    }

    if (meta?.ogTitle !== undefined) {
      const fullOgTitle = meta.ogTitle
        ? this._getTitle(meta.ogTitle)
        : this._config.baseTitle;

      this._meta.updateTag({
        content: fullOgTitle,
        property: 'og:title'
      });

      this._meta.updateTag({
        content: fullOgTitle,
        name: 'twitter:title'
      });
    }

    let localHref = meta?.image;

    const parsedHref = this._document.location.href.split('/');
    const href = parsedHref[0] + '//' + parsedHref[2];

    if (meta?.image && meta?.image.startsWith('/')) {
      localHref = href + meta.image;
    }

    this._meta.updateTag({
      content: localHref,
      property: 'og:image'
    });

    const ogDesc = meta?.ogDescription || meta?.description;

    this._meta.updateTag({
      content: ogDesc,
      property: 'og:description'
    });

    this._meta.updateTag({
      content: ogDesc,
      name: 'twitter:description'
    });

    this._meta.updateTag({
      content: this._document.location.href,
      property: 'og:url'
    });

    this._meta.updateTag({
      content: 'website',
      property: 'og:type'
    });

    this._meta.updateTag({
      content: 'summary_large_image',
      name: 'twitter:card'
    });

    if (meta?.twitterImage) {

      let localTwitterHref = meta.twitterImage;

      if (meta?.twitterImage.startsWith('/')) {
        localTwitterHref = href + meta?.twitterImage;
      }

      this._meta.updateTag({
        content: localTwitterHref,
        name: 'twitter:image'
      });

    }
  }

  private _getTitle(title: string | string[]) {
    return `${arrayify(title).join(` ${this._config.separator} `)} ${this._config.separator} ${this._config.baseTitle}`;
  }
}
