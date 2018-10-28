import { Injectable }                         from '@angular/core';
import { CanActivate }                        from '@angular/router';
import { Store }                              from '@ngrx/store';
import { Observable, of as observableOf }     from 'rxjs';
import { entitySelectors, entityActions }     from '../store';
import { State }                              from 'app/store';

@Injectable()
export class EntitiesGuard implements CanActivate {

  constructor(private store: Store<State>) { }

  // wrapping the logic so we can .switchMap() it
  getFromStoreOrAPI(): Observable<any> {

    // return an Observable stream from the store
    return this.store
      // selecting entidades total entities state using a @ngrx/entity feature selector
      .select(entitySelectors.selectTotal)
      // the .do() operator allows for a side effect, at this point, I'm checking if the entidades are loaded on my Store slice of state
      .do((data: number) => {
        // if there are no entidades loaded, dispatch an action to hit the backend
        if (!data) this.store.dispatch(new entityActions.LoadAll());
      })
      // filter out data.courses, no length === empty!
      .filter(data => !!data)
      // which if empty, we will never .take() this is the same as .first() which will only
      // take 1 value from the Observable then complete which does our unsubscribing, technically.
      .take(1);
  }

  // our guard that gets called each time we
  // navigate to a new route
  canActivate(): Observable<boolean> {
    // return our Observable stream from above
    return this.getFromStoreOrAPI()
      // if it was successful, we can return Observable.of(true)
      .switchMap(() => observableOf(true))
      // otherwise, something went wrong
      .catch(() => observableOf(false));
  }

}
