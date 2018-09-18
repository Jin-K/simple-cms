import { Injectable, OnDestroy }  from '@angular/core';
import { PaginationSettings }     from './pagination-settings.class';

import * as _                     from 'lodash';

@Injectable()
export class PaginationService<T> implements OnDestroy {
  private static entitiesSettingsCache: _.Dictionary<PaginationSettings<any>> = {};

  getPaginationSettings(entity: string) {
    if (!PaginationService.entitiesSettingsCache[entity]) PaginationService.entitiesSettingsCache[entity] = new PaginationSettings<T>();
    return PaginationService.entitiesSettingsCache[entity];
  }

  ngOnDestroy(): void {
    _.forEach(PaginationService.entitiesSettingsCache, settings => settings.destroy());
  }
}
