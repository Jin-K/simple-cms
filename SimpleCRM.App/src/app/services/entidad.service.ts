import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable }               from 'rxjs';
import { OidcSecurityService }      from 'angular-auth-oidc-client';

import { Configuration }            from '../app.constants';
import { IEntidad, IItem }          from '../models/interfaces';
import { PaginationService }        from '../core/services/pagination.service';

const AUTHORIZATION_HEADER = 'Authorization';
const APPLICATION_JSON = 'application/json';

@Injectable()
export class EntidadService {
  private actionUrl = `${this.configuration.Server}api/entity`;
  private _headers: HttpHeaders = new HttpHeaders();

  private get headers(): HttpHeaders {
    this.ensureAuthorization();
    return this._headers;
  }

  constructor(
    private http: HttpClient,
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService,
    private paginationService: PaginationService<IItem>
  ) {
    // using private member to avoid multiple calls on getter -> _ensureAuthorization
    this._headers = this._headers.set('Content-Type', APPLICATION_JSON);
    this._headers = this._headers.set('Accept', APPLICATION_JSON);
  }

  getAllEntidades(): Observable<IEntidad[]> {
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

  private ensureAuthorization(): void {
    const token = this.oidcSecurityService.getToken();
    if (token !== '') {
      const tokenValue = `Bearer ${token}`;
      this._headers = this._headers.has(AUTHORIZATION_HEADER) ?
        this._headers.set(AUTHORIZATION_HEADER, tokenValue) :
        this._headers.append(AUTHORIZATION_HEADER, tokenValue);
    }
  }
}
