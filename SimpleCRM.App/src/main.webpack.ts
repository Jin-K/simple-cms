import './styles.scss';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'app/app.module';
import 'hammerjs';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

// enables HMR
declare var module: any;
if (module.hot) module.hot.accept();

platformBrowserDynamic().bootstrapModule(AppModule).catch( err => console.log(err) );
