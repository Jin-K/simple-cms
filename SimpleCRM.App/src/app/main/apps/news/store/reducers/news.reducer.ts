import { NewsState, INITIAL_NEWS_STATE }  from './state';
import * as newsAction                    from '../actions/news.actions';

export function newsReducer(state: NewsState = INITIAL_NEWS_STATE, action: newsAction.Actions): NewsState {
  switch (action.type) {

    case newsAction.RECEIVED_GROUP_JOINED:
      return Object.assign({}, state, {
        newsItems: state.newsItems,
        groups: (state.groups.indexOf(action.group) > -1) ? state.groups : state.groups.concat(action.group)
      });

    case newsAction.RECEIVED_NEWS_ITEM:
      return Object.assign({}, state, {
        newsItems: state.newsItems.concat(action.newsItem),
        groups: state.groups
      });

    case newsAction.RECEIVED_GROUP_HISTORY:
      return Object.assign({}, state, {
        newsItems: action.newsItems,
        groups: state.groups
      });

    case newsAction.RECEIVED_GROUP_LEFT:
      const data = [];
      for (const entry of state.groups) {
        if (entry !== action.group)
          data.push(entry);
      }
      return Object.assign({}, state, {
        newsItems: state.newsItems,
        groups: data
      });

    case newsAction.SELECT_ALL_GROUPS_COMPLETE:
      return Object.assign({}, state, {
        newsItems: state.newsItems,
        groups: action.groups
      });

    default:
      return state;
  }
}
