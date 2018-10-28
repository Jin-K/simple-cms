import { NgModule, APP_INITIALIZER }                                              from '@angular/core';
import { HTTP_INTERCEPTORS }                                                      from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule }                                                           from '@angular/router';
import { OidcSecurityService, AuthModule as AAOCAuthModule }                      from 'angular-auth-oidc-client';

import { FuseSharedModule }                                                       from '@fuse/shared.module';

import { CoreBrowserStorage, OidcConfigFactory, CoreOidcConfigService }           from '@core/services';

import { LoginComponent }                                                         from './login/login.component';
import { UnauthorizedComponent }                                                  from './unauthorized/unauthorized.component';
import { ForbiddenComponent }                                                     from './forbidden/forbidden.component';
import { AuthStoreModule }                                                        from './store/store.module';
import { AuthInterceptor }                                                        from './auth-interceptor.service';
import { AuthService }                                                            from './auth.service';

const routes = [
  {
    path      : 'auth/login',
    component : LoginComponent
  },
  {
    path      : 'auth/unauthorized',
    component : UnauthorizedComponent
  },
  {
    path      : 'auth/borbidden',
    component : ForbiddenComponent
  }
];

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
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,

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
   * @param {CoreOidcConfigService} coreConfigService 
   * @param {AuthService} authService 
   */
  constructor(
    private coreConfigService: CoreOidcConfigService,
    private authService: AuthService
  ) {
    this.coreConfigService.onConfigurationLoaded.subscribe(this.authService.setupModule.bind(this.authService));
  }
}
