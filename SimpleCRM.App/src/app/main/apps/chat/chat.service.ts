import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                     from '@angular/router';
import { Observable } from 'rxjs';

/**
 * The main ChatService class
 *
 * @export
 * @class ChatService
 * @implements {Resolve<any>}
 */
@Injectable()
export class ChatService implements Resolve<any> {

  /**
   * Constructor.
   * Creates an instance of ChatService.
   *
   * @memberof ChatService
   */
  constructor() { }

  /**
   * Resolve route data for chat components
   *
   * @param {ActivatedRouteSnapshot} route activated route snapshot
   * @param {RouterStateSnapshot} state router state snapshot
   * @returns {(Observable<any> | Promise<any> | any)} observable of any
   * @memberof ChatService
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    // return
    return null;
  }

}
