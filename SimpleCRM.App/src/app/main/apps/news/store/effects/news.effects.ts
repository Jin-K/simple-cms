import { Injectable }                 from '@angular/core';
import { Actions, Effect, ofType }    from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of }                         from 'rxjs';

import { NewsService }                from '../../news.service';
import * as newsActions               from '../actions/news.actions';

@Injectable()
export class NewsEffects {
  constructor(
    private newsService: NewsService,
    private actions$: Actions
  ) { }

  @Effect() sendNewItem$ = this.actions$.pipe(
    ofType<newsActions.SendNewsItemAction>(newsActions.SEND_NEWS_ITEM),
    switchMap((action: newsActions.SendNewsItemAction) => {
      this.newsService.send(action.newsItem);
      return of(new newsActions.SendNewsItemActionComplete(action.newsItem));
    })
  );

  @Effect() joinGroup$ = this.actions$.pipe(
    ofType<newsActions.JoinGroupAction>(newsActions.JOIN_GROUP),
    switchMap((action: newsActions.JoinGroupAction) => {
      this.newsService.joinGroup(action.group);
      return of(new newsActions.JoinGroupActionComplete(action.group));
    })
  );

  @Effect() leaveGroup$ = this.actions$.pipe(
    ofType<newsActions.LeaveGroupAction>(newsActions.LEAVE_GROUP),
    switchMap((action: newsActions.LeaveGroupAction) => {
      this.newsService.leaveGroup(action.group);
      return of(new newsActions.LeaveGroupActionComplete(action.group));
    })
  );

  @Effect() getAllGroups$ = this.actions$.pipe(
    ofType(newsActions.SELECT_ALL_GROUPS),
    switchMap(() => {
      return this.newsService.getAllGroups().pipe(
        map((data: string[]) =>  new newsActions.SelectAllGroupsActionComplete(data)),
        catchError((error: any) => of(error))
      );
    })
  );
}
