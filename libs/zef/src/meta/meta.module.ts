import { NgModule, ModuleWithProviders } from '@angular/core';
import { MetaService } from './meta.service';
import { META_CONFIG } from './meta.constant';

@NgModule({
})
export class ZefMetaModule {
  static forRoot(): ModuleWithProviders<ZefMetaModule> {
    return {
      ngModule: ZefMetaModule,
      providers: [
        {
          provide: META_CONFIG,
          useValue: {
            baseTitle: '',
            separator: '~'
          }
        },
        MetaService
      ]
    };
  }
}
