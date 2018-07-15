import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription }     from 'rxjs';
import { Store }                        from '@ngrx/store';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import { NewsState }                    from '../store/news.state';
import * as NewsActions                 from '../store/news.actions';
import { NewsItem }                     from '../models/news-item';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  public async: any;
  newsItem: NewsItem;
  newsItems: NewsItem[] = [];
  group = 'IT';
  author = 'unknown';
  newsState$: Observable<NewsState>;
  groups = ['IT', 'global', 'sport'];

  isAuthorizedSubscription: Subscription;
  isAuthorized = false;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.newsState$ = this.store.select<NewsState>(state => state.news);

    this.store.select<NewsState>(state => state.news).subscribe((o: NewsState) => this.newsItems = o.newsItems);

    console.log(this.newsItems);
    this.newsItem = new NewsItem();
    this.newsItem.AddData('', '', this.author, this.group);
  }

  public sendNewsItem(): void {
    this.newsItem.newsGroup = this.group;
    this.newsItem.author = this.author;
    this.store.dispatch(new NewsActions.SendNewsItemAction(this.newsItem));
  }

  public join(): void {
    console.log('join');
    this.store.dispatch(new NewsActions.JoinGroupAction(this.group));
  }

  public leave(): void {
    this.store.dispatch(new NewsActions.LeaveGroupAction(this.group));
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
        if (this.isAuthorized) {
          console.log('this.store.dispatch(new NewsActions.SelectAllGroupsAction());');
          this.store.dispatch(new NewsActions.SelectAllGroupsAction());
        }
      }
    );
    console.log('IsAuthorized:' + this.isAuthorized);
  }

  ngOnDestroy(): void {
    if (this.isAuthorizedSubscription) this.isAuthorizedSubscription.unsubscribe();
  }
}
