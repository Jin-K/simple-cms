import { NgModule, APP_INITIALIZER }                                    from '@angular/core';
import { HTTP_INTERCEPTORS }                                            from '@angular/common/http';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSnackBarModule
}                                                                       from '@angular/material';
import { RouterModule, Route }                                          from '@angular/router';
import { OidcSecurityService, AuthModule as AAOCAuthModule }            from 'angular-auth-oidc-client';

import { FuseSharedModule }                                             from '@fuse/shared.module';
import { CoreBrowserStorage, OidcConfigFactory, CoreOidcConfigService } from '@core/services';

import { LoginComponent }                                               from './login/login.component';
import { UnauthorizedComponent }                                        from './unauthorized/unauthorized.component';
import { ForbiddenComponent }                                           from './forbidden/forbidden.component';
import { AuthStoreModule }                                              from './store/store.module';
import { AuthInterceptor }                                              from './auth-interceptor.service';
import { AuthService }                                                  from './auth.service';

/**
 * Routes for the core auth module
 *
 * @version 0.0.1
 * @constant
 * @type {Route[]}
 */
const routes: Route[] = [

  /**
   * @name /auth/login
   * Authentication page
   */
  {
    path      : 'auth/login',
    component : LoginComponent
  },
  /**
   * @name /auth/unauthorized
   * Unauthorized page
   */
  {
    path      : 'auth/unauthorized',
    component : UnauthorizedComponent
  },
  /**
   * @name /auth/forbidden
   * Forbidden page
   */
  {
    path      : 'auth/forbidden',
    component : ForbiddenComponent
  }

];

/**
 * The main AuthModule class.
 * Is imported in CoreModule
 *
 * @export
 * @class AuthModule
 */
@NgModule({
  declarations: [
    LoginComponent,
    UnauthorizedComponent,
    ForbiddenComponent
  ],
  imports: [
    // specific routes for auth
    RouterModule.forChild(routes),

    // angular-auth-oidc-client's AuthModule
    // AAOCAuthModule.forRoot({storage: CoreBrowserStorage}),
    AAOCAuthModule.forRoot({storage: CoreBrowserStorage}),

    // material modules
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,

    // fuse shared module
    FuseSharedModule,

    // auth store module
    AuthStoreModule
  ],
  providers: [
    OidcSecurityService,
    CoreOidcConfigService,
    {
      provide   : APP_INITIALIZER,
      useFactory: OidcConfigFactory,
      deps      : [CoreOidcConfigService],
      multi     : true
    },
    {
      provide   : HTTP_INTERCEPTORS,
      useClass  : AuthInterceptor,
      multi     : true
    },
  ]
})
export class AuthModule {

  /**
   * Constructor
   *
   * @param {CoreOidcConfigService} coreConfigService core configuration service
   * @param {AuthService} authService core auth service
   */
  constructor(
    private coreConfigService: CoreOidcConfigService,
    private authService: AuthService
  ) {

    // subscribe to data retrieval from our config service and give callback method located
    // in our auth service to setup the wrapped 'angular-auth-oidc-client' package module
    // TODO it's weird, I know xD
    this.coreConfigService.onConfigurationLoaded.subscribe(this.authService.setupRealAuthModuleModule.bind(this.authService));

  }

}
