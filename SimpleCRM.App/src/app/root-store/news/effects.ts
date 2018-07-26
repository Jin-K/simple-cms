import { Injectable }                 from '@angular/core';
import { Actions, Effect }            from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of }                         from 'rxjs';

import { NewsService }                from '../../core/services/news.service';
import * as newsAction                from './actions';

@Injectable()
export class NewsEffects {
  constructor(
    private newsService: NewsService,
    private actions$: Actions
  ) { }

  @Effect() sendNewItem$ = this.actions$.ofType<newsAction.SendNewsItemAction>(newsAction.SEND_NEWS_ITEM).pipe(
    switchMap((action: newsAction.SendNewsItemAction) => {
      this.newsService.send(action.newsItem);
      return of(new newsAction.SendNewsItemActionComplete(action.newsItem));
    })
  );

  @Effect() joinGroup$ = this.actions$.ofType<newsAction.JoinGroupAction>(newsAction.JOIN_GROUP).pipe(
    switchMap((action: newsAction.JoinGroupAction) => {
      this.newsService.joinGroup(action.group);
      return of(new newsAction.JoinGroupActionComplete(action.group));
    })
  );

  @Effect() leaveGroup$ = this.actions$.ofType<newsAction.LeaveGroupAction>(newsAction.LEAVE_GROUP).pipe(
    switchMap((action: newsAction.LeaveGroupAction) => {
      this.newsService.leaveGroup(action.group);
      return of(new newsAction.LeaveGroupActionComplete(action.group));
    })
  );

  @Effect() getAllGroups$ = this.actions$.ofType(newsAction.SELECTALL_GROUPS).pipe(
    switchMap(() => {
      return this.newsService.getAllGroups().pipe(
        map((data: string[]) =>  new newsAction.SelectAllGroupsActionComplete(data)),
        catchError((error: any) => of(error))
      );
    })
  );
}
