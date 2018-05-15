import { NewsState, INITIAL_NEWS_STATE }  from './news.state';
import * as NewsAction                    from './news.actions';

export function newsReducer(state: NewsState = INITIAL_NEWS_STATE, action: NewsAction.Actions): NewsState {
  switch (action.type) {

    case NewsAction.RECEIVED_GROUP_JOINED:
      return Object.assign({}, state, {
        newsItems: state.news.newsItems,
        groups: (state.news.groups.indexOf(action.group) > -1) ? state.news.groups : state.news.groups.concat(action.group)
      });

    case NewsAction.RECEIVED_NEWS_ITEM:
      return Object.assign({}, state, {
        newsItems: state.news.newsItems.concat(action.newsItem),
        groups: state.news.groups
      });

    case NewsAction.RECEIVED_GROUP_HISTORY:
      return Object.assign({}, state, {
        news: {
          newsItems: action.newsItems,
          groups: state.news.groups
        }
      });

    case NewsAction.RECEIVED_GROUP_LEFT:
      const data = [];
      for (const entry of state.news.groups) {
        if (entry !== action.group)
          data.push(entry);
      }
      console.log(data);
      return Object.assign({}, state, {
        newsItems: state.news.newsItems,
        groups: data
      });

    case NewsAction.SELECTALL_GROUPS_COMPLETE:
      return Object.assign({}, state, {
        news: {
          newsItems: state.news.newsItems,
          groups: action.groups
        }
      });

    default:
      return state;
  }
}
