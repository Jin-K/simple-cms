import { NewsItem } from '../models/news-item';

/** **** **** **** **** **** **** ** NewsState ** **** **** **** **** **** **** **/
export interface NewsState {
  news: NewsStateContainer;
}

export const INITIAL_NEWS_STATE: NewsState = {
  news: {
    newsItems: [],
    groups: ['IT', 'global', 'sport']
  }
};

export interface NewsStateContainer {
  newsItems: NewsItem[];
  groups: string[];
}
