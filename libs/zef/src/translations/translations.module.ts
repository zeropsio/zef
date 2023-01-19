import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  TRANSLOCO_CONFIG,
  TranslocoModule,
  TRANSLOCO_TRANSPILER
} from '@ngneat/transloco';
import { MessageFormatTranspiler } from '@ngneat/transloco-messageformat';

@NgModule({
  imports: [ TranslocoModule ]
})
export class ZefTranslationsModule {
  static forRoot(production: boolean): ModuleWithProviders<ZefTranslationsModule> {
    return {
      ngModule: ZefTranslationsModule,
      providers: [
        {
          provide: TRANSLOCO_TRANSPILER,
          useClass: MessageFormatTranspiler
        },
        {
          provide: TRANSLOCO_CONFIG,
          useValue: {
            prodMode: production,
            listenToLangChange: true,
            defaultLang: 'en',
            scopeStrategy: 'shared'
          }
        }
      ]
    };
  }
}
