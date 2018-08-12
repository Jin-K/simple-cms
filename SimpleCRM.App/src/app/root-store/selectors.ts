import { createSelector }   from '@ngrx/store';
import { ApplicationState } from './application-state';
import { RouterStateUrl }   from './router-state-serializer';

const INITIAL_ROUTER_STATE = {
  url: '/',
  params: {},
  queryParams: {}
};

const getRouterStateUrl = (state: ApplicationState) => state.router === undefined ? INITIAL_ROUTER_STATE : state.router.state;

export const getUrlParams = createSelector(getRouterStateUrl, (state: RouterStateUrl) => state.params);
