import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable }               from 'rxjs';
import { OidcSecurityService }      from 'angular-auth-oidc-client';

import { Configuration }            from '../app.constants';
import { IEntidad, IItem }          from '../models/interfaces';

@Injectable()
export class EntidadService {
  private actionUrl: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.actionUrl = `${this.configuration.Server}api/entity`;

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

  getAllEntidades(): Observable<IEntidad[]> {
    this._ensureAuthorization();
    return this.http.get<IEntidad[]>(this.actionUrl, { headers: this.headers });
  }

  getAllItems(entity: string): Observable<IItem[]> {
    console.log(`fetching items of "${ entity }" entity`);
    this._ensureAuthorization();
    return this.http.get<IItem[]>(`${this.actionUrl}/${entity}`, { headers: this.headers });
  }

  _ensureAuthorization(): void {
    if (!this.headers.has('Authorization')) {
      const token = this.oidcSecurityService.getToken();
      if (token !== '') {
        const tokenValue = `Bearer ${token}`;
        this.headers = this.headers.append('Authorization', tokenValue);
      }
    }
  }
}
