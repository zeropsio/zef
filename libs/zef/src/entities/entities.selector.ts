import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FEATURE_NAME } from './constants';
import { ZefEntitiesState } from './entity-manager.model';
import { selectZefEntitiesList, selectZefEntitiesListAdditionalInfo } from './utils';

export const selectEntitiesState = createFeatureSelector<ZefEntitiesState>(FEATURE_NAME);

export const selectEntities = createSelector(
  selectEntitiesState,
  (state) => state ? state.entities : {}
);

export const selectEntityList = (entityName: string, tag?: string) => selectZefEntitiesList(
  selectEntitiesState,
  entityName,
  tag
);

export const selectEntityListAdditionalInfo = (entityName: string, tag?: string) => selectZefEntitiesListAdditionalInfo(
  selectEntitiesState,
  entityName,
  tag
);

