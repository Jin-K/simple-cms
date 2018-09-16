import { Injectable, OnDestroy }    from '@angular/core';
import { EntityPaginationSettings } from './../classes/entity-pagination.settings';

import * as _                       from 'lodash';

@Injectable()
export class PaginationService implements OnDestroy {
  private static entitiesSettingsCache: _.Dictionary<EntityPaginationSettings> = {};

  getPaginationSettings(entity: string) {
    if (!PaginationService.entitiesSettingsCache[entity]) PaginationService.entitiesSettingsCache[entity] = new EntityPaginationSettings();
    return PaginationService.entitiesSettingsCache[entity];
  }

  ngOnDestroy(): void {
    _.forEach(PaginationService.entitiesSettingsCache, settings => settings.destroy());
  }
}
