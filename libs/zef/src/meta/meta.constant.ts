import { InjectionToken } from '@angular/core';
import { MetaConfig } from './meta.model';

export const META_CONFIG = new InjectionToken<MetaConfig>('zerops.meta');
