import { HttpHeaders, HttpClient }  from '@angular/common/http';
import { Injectable }               from '@angular/core';
import { Observable }               from 'rxjs';

import { PaginationService }        from '@core/pagination';

import { IItem, IEntidad }          from 'app/models';
import { coreConfig }               from 'app/config';

const APPLICATION_JSON      = 'application/json';

@Injectable()
export class EntityService {
  private actionUrl = `${coreConfig.apiServer}/api/entity`;
  private headers: HttpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService<IItem>
  ) {
    this.headers = this.headers.set('Content-Type', APPLICATION_JSON);
  }

  getAllEntities(): Observable<IEntidad[]> {
    return this.http.get<IEntidad[]>(`${this.actionUrl}/entities`, { headers: this.headers });
  }

  getAll(entity: string) {
    const paginationSettings = this.paginationService.getPaginationSettings(entity);
    paginationSettings.loading = true;
    const requestUrl = `${this.actionUrl}/all?page=${paginationSettings.page}`
      + `&pageCount=${paginationSettings.pageSize}`
      + `&orderBy=${paginationSettings.sort}&query=${entity}`;
    return this.http.get<IItem[]>(requestUrl, { observe: 'response', headers: this.headers });
  }

  getItem(entity: string, id: string): Observable<IItem> {
    const requestUrl = `${this.actionUrl}/item?entity=${entity}&id=${id}`;
    return this.http.get<IItem>(requestUrl, { headers: this.headers });
  }
}
