import './styles.scss';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'hammerjs';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

// enables HMR
declare var module: any;
if (module.hot) module.hot.accept();

platformBrowserDynamic().bootstrapModule(AppModule).catch( err => console.log(err) );
