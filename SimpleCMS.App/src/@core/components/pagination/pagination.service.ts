import { Injectable, OnDestroy } from '@angular/core';
import { PaginationSettings } from './classes/pagination-settings.class';

@Injectable()
export class PaginationService<T> implements OnDestroy {
  private static entitiesSettingsCache: Map<string, PaginationSettings<any>> = new Map();

  getPaginationSettings(entity: string) {
    if (!PaginationService.entitiesSettingsCache[entity]) PaginationService.entitiesSettingsCache[entity] = new PaginationSettings<T>();
    return PaginationService.entitiesSettingsCache[entity];
  }

  ngOnDestroy(): void {
    PaginationService.entitiesSettingsCache.forEach(settings => settings.destroy());
  }
}
