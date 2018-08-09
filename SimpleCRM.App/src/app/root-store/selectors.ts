import { createSelector }   from '@ngrx/store';
import { ApplicationState } from './application-state';
import { RouterStateUrl }   from './router-state-serializer';

const getRouterStateUrl = (state: ApplicationState) => state.router.state;

export const getUrlParams = createSelector(getRouterStateUrl, (state: RouterStateUrl) => state.params);
