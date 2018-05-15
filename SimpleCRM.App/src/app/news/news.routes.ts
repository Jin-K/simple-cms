import { Routes, RouterModule } from '@angular/router';
import { NewsComponent }        from './components/news.component';

const routes: Routes = [
  { path: '', component: NewsComponent, pathMatch: 'full' }
];

export const NewsRoutes = RouterModule.forChild(routes);
