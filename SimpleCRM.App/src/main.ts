// import './styles.scss'; // referenced in angular.json

import { enableProdMode }         from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule }              from './app/app.module';
import { environment }            from './environments/environment';
import 'hammerjs';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

if (environment.production) enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule).catch( err => console.log(err) );
