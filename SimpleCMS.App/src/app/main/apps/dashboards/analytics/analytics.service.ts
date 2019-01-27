import { Injectable }                                           from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders }                              from '@angular/common/http';
import { Observable }                                           from 'rxjs';

import { coreConfig }                                           from 'app/config';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any> {
  widgets: any[];
  private _headers: HttpHeaders;
  actionUrl: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient
  ) {
    this.actionUrl = `${coreConfig.apiServer}/api/widget`;

    this._headers = new HttpHeaders();
    this._headers = this._headers.set('Content-Type', 'application/json' );
    this._headers = this._headers.set('Accept', 'application/json' );
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getWidgets()
      ]).then(_ => resolve(), reject);
    });
  }

  /**
   * Get widgets
   *
   * @returns {Promise<any>}
   */
  getWidgets(): Promise<any> {
    return new Promise((resolve) => {
      this._httpClient.get(this.actionUrl)
        .subscribe((response: any) => {
          this.widgets = response;
          resolve(response);
        }, _ => resolve(this.widgets = []));
    });
  }
}
