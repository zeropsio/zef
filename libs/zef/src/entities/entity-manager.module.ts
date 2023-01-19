import { NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { METADATA_TOKEN, FEATURE_NAME, API_PREFIX } from './constants';
import { EntityManagerConfig } from './entity-manager.model';
import { reducer } from './entity-manager.reducer';
import { CollectionManagerService } from './collection-manager.service';
import { EntityManagerEffect } from './entity-manager.effect';

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forFeature(FEATURE_NAME, reducer),
    EffectsModule.forFeature([ EntityManagerEffect ])
  ]
})
export class ZefEntitiesModule {
  static forRoot(config?: EntityManagerConfig): ModuleWithProviders<ZefEntitiesModule> {
    return {
      ngModule: ZefEntitiesModule,
      providers: [
        {
          provide: METADATA_TOKEN,
          useValue: config?.metadata
        },
        {
          provide: API_PREFIX,
          useValue: config?.config?.apiPrefix || ''
        }
      ]
    };
  }

  constructor(
    @Inject(METADATA_TOKEN)
    private _metadata: any,
    private _collectionManager: CollectionManagerService
  ) {
    if (this._metadata) {
      this._collectionManager.create(this._metadata);
    }
  }
}
