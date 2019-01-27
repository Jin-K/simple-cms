import { Component, OnInit, OnDestroy }       from '@angular/core';
import { Store }                              from '@ngrx/store';
import { Observable, Subscription, Subject }  from 'rxjs';
import { takeUntil }                          from 'rxjs/operators';

import { getUserIsAuthorized }                from '@core/auth';

import * as fromStore                         from './store';
import { NewsItem }                           from '../../../models/news-item.class';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  // Private
  private readonly _unsubscribeAll: Subject<any> = new Subject();

  // Public
  async: any;
  newsItem: NewsItem;
  newsItems: NewsItem[] = [];
  group = 'IT';
  author = 'unknown';
  newsState$: Observable<fromStore.NewsState>;
  groups = ['IT', 'global', 'sport'];

  constructor(private store: Store<any>) {
    this.newsState$ = this.store.select<fromStore.NewsState>(state => state.news);

    this.store.select<fromStore.NewsState>(state => state.news)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((o: fromStore.NewsState) => this.newsItems = o.newsItems);

    this.newsItem = new NewsItem();
    this.newsItem.AddData('', '', this.author, this.group);
  }

  public sendNewsItem(): void {
    this.newsItem.newsGroup = this.group;
    this.newsItem.author = this.author;
    this.store.dispatch(new fromStore.SendNewsItemAction(this.newsItem));
  }

  public join(): void {
    this.store.dispatch(new fromStore.JoinGroupAction(this.group));
  }

  public leave(): void {
    this.store.dispatch(new fromStore.LeaveGroupAction(this.group));
  }

  ngOnInit() {
    this.store.select(getUserIsAuthorized)
        .pipe(takeUntil(this._unsubscribeAll))
        .filter(isAuthorized => isAuthorized)
        .subscribe(_ => this.store.dispatch(new fromStore.SelectAllGroupsAction()));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
