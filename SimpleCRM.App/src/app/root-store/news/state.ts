import { NewsItem } from '../../models/news-item';

/** **** **** **** **** **** **** ** NewsState ** **** **** **** **** **** **** **/
export interface NewsState extends NewsStateContainer { }

export const INITIAL_NEWS_STATE: NewsState = {
  newsItems: [],
  groups: ['IT', 'global', 'sport']
};

export interface NewsStateContainer {
  newsItems: NewsItem[];
  groups: string[];
}
