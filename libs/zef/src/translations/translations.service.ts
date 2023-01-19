import { Injectable } from '@angular/core';
import { TranslocoService, Translation, HashMap } from '@ngneat/transloco';
import { map } from 'rxjs/operators';
import keys from 'lodash-es/keys';

@Injectable({ providedIn: 'root' })
export class ZefTranslationsService {
  constructor(private _translocoService: TranslocoService) { }

  setTranslations(key: string, translations: { [language: string]: Translation; }) {
    keys(translations).forEach((k) => {
      this._translocoService.setTranslation({
        [key]: translations[k]
      }, k, { merge: true });
    });
  }

  translate$<T>(key: string, params?: HashMap<any>) {
    return this._translocoService
      .selectTranslate<T>(key, params)
      .pipe(map((d) => [ d ]));
  }

  selectTranslate$<T>(key: string, params?: HashMap<any>) {
    return this._translocoService.selectTranslate<T>(key, params);
  }

  getActiveLanguage() {
    return this._translocoService.getActiveLang();
  }
}
