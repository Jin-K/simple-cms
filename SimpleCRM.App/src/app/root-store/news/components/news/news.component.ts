import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription }     from 'rxjs';
import { Store }                        from '@ngrx/store';
import { OidcSecurityService }          from 'angular-auth-oidc-client';

import { newsActions, newsState }       from '../../../../root-store/news';
import { NewsItem }                     from '../../../../core/models';

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
  newsState$: Observable<newsState.NewsState>;
  groups = ['IT', 'global', 'sport'];

  isAuthorizedSubscription!: Subscription;
  newsItemsSubscription: Subscription;
  isAuthorized = false;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.newsState$ = this.store.select<newsState.NewsState>(state => state.news);

    this.newsItemsSubscription = this.store.select<newsState.NewsState>(state => state.news)
          .subscribe((o: newsState.NewsState) => this.newsItems = o.newsItems);

    this.newsItem = new NewsItem();
    this.newsItem.AddData('', '', this.author, this.group);
  }

  public sendNewsItem(): void {
    this.newsItem.newsGroup = this.group;
    this.newsItem.author = this.author;
    this.store.dispatch(new newsActions.SendNewsItemAction(this.newsItem));
  }

  public join(): void {
    this.store.dispatch(new newsActions.JoinGroupAction(this.group));
  }

  public leave(): void {
    this.store.dispatch(new newsActions.LeaveGroupAction(this.group));
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
        if (this.isAuthorized) this.store.dispatch(new newsActions.SelectAllGroupsAction());
      }
    );
    console.log('IsAuthorized:' + this.isAuthorized);
  }

  ngOnDestroy(): void {
    if (this.isAuthorizedSubscription) this.isAuthorizedSubscription.unsubscribe();
    this.newsItemsSubscription.unsubscribe();
  }
}
