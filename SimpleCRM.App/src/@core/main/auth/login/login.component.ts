import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators }         from '@angular/forms';
import { ActivatedRoute }                             from '@angular/router';
import { Subject }                                    from 'rxjs';
import { takeUntil }                                  from 'rxjs/operators';
import { OidcSecurityService }                        from 'angular-auth-oidc-client';

import { fuseAnimations }                             from '@fuse/animations';
import { FuseProgressBarService }                     from '@fuse/components/progress-bar/progress-bar.service';
import { FuseConfigService }                          from '@fuse/services/config.service';

import { AuthService }                                from '../auth.service';

const APPLICATION_ORIGIN  = 'APPLICATION_ORIGIN_';
const STS_ORIGIN          = 'STS_ORIGIN_';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
  // Private
  private iFrame: HTMLIFrameElement;
  private popupWindow: {wnd: Window, external: string} = {wnd: null, external: ''};
  private _unsubscribeAll: Subject<any>;
  private progressBarBufferValue: number;
  
  // Public
  loginForm: FormGroup;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   * @param {OidcSecurityService} oidcSecurityService
   * @param {FuseProgressBarService} fuseProgressBarService
   * @param {AuthService} authService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private oidcSecurityService: OidcSecurityService,
    private fuseProgressBarService: FuseProgressBarService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      RememberMe: false
    });
    
    // subscribe to the progress bar service Buffer value property
    this.fuseProgressBarService.bufferValue
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(bufferValue => this.progressBarBufferValue = bufferValue);
  }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * Add an Iframe to body of the main window
   * ref: https://github.com/damienbod/angular-auth-oidc-client/blob/master/src/services/existing-iframe.service.ts
   * @param {string} identifier id to give to the new iframe
   */
  private getOrCreateWindowBodyIframe(identifier = 'auth_iframe'): HTMLIFrameElement {
    // return iframe if already exists
    const existing = window.document.getElementById(identifier);
    if (existing) return existing as HTMLIFrameElement;

    // create new hidden iframe
    const sessionIframe = window.document.createElement('iframe');
    sessionIframe.id = identifier;
    sessionIframe.style.display = 'none';

    // append to body and return
    window.document.body.appendChild(sessionIframe);
    return sessionIframe;
}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Login with form
   */
  login(): void {
    // show progress bar
    this.fuseProgressBarService.setMode('buffer');
    this.fuseProgressBarService.show();
    
    // if not defined yet
    if (!this.iFrame) {
      
      // create iframe
      this.iFrame = this.getOrCreateWindowBodyIframe();
      
      // load content of login page in the iframe
      this.oidcSecurityService.authorize((url: string) => {
      
        // clear buffered progress bar value the first time
        this.fuseProgressBarService.setBufferValue(0);
        
        // load
        this.iFrame.src = url;
        
        // on load
        this.iFrame.onload = () => {
          
          // if onload of get request (in iframe)
          if (this.iFrame.contentDocument === null) {

            // request a login
            this.iFrame.contentWindow.postMessage({
              action  : 'login',
              message : this.loginForm.value
            }, '*');

            // unsubscrive from onload
            this.iFrame.onload = null;
          }
        }
      });
    }
    else {
      // request a login
      this.iFrame.contentWindow.postMessage({
        action: 'login',
        message: this.loginForm.value
      }, '*');
    }
  }

  /**
   * Login with external
   * @param {string} external type of external we want to login with
   */
  externalLogin(external: string): void {
    // show progress bar
    this.fuseProgressBarService.setMode('indeterminate');
    this.fuseProgressBarService.show();
    
    // load content of login page in a new popup window
    this.oidcSecurityService.authorize((url: string) => {

      // clear iFrame if one exists to create a new one if we try to log in via the basic form again, otherwise the token validation will fail
      this.iFrame = null

      // open new window
      const wnd = window.open(url, "_blank", "toolbar=0,location=0,menubar=0,width=640,height=480");

      // check regulary if closed (750 ms)
      const timer = setInterval(() => {

        // skip if still open
        if (!wnd.closed) return;

        // stop checking if closed
        clearInterval(timer);

        // hide progress bar
        this.fuseProgressBarService.hide();
      }, 750);

      // attach new window
      this.popupWindow.wnd = wnd;

      // add external kind as meta data
      this.popupWindow.external = external;
    });
  }

  /**
   * Callback for received window messages (coming from self-created iframe or popup)
   * @param {MessageEvent} event generated event containing the message data
   */
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent): void {
    // if the data does not have the expected properties
    if (!event.data.action || !event.data.message) return;

    // determine if it comes from one of the expected origins
    let origin_type: string;
    if (~event.origin.indexOf('https://localhost:44300') || ~event.origin.indexOf('http://localhost:4200'))
      origin_type = APPLICATION_ORIGIN;
    else if (~event.origin.indexOf('https://localhost:44321') || ~event.origin.indexOf('http://localhost:50772'))
      origin_type = STS_ORIGIN;
    else return;

    // react to the type of action
    switch(origin_type + event.data.action) {
      
      // if coming from same origin (auth_callback.html)
      case `${APPLICATION_ORIGIN}hash`:

        // reset angular-auth-oidc-client configuration with new returnUrl ...
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl']
        if (returnUrl) this.authService.resetPostLoginRoute(returnUrl);

        // run callback for authorization with received token
        this.oidcSecurityService.authorizedCallback(event.data.message);

        // handle progress bar if trying to login via iFrame
        if (this.iFrame !== null && this.progressBarBufferValue === 2/3 * 100) {

          // complete progress bar
          this.fuseProgressBarService.setBufferValue(3/3 * 100);

          // hide it after 750ms
          const timer = setTimeout(() => {

            // hide progress bar
            this.fuseProgressBarService.hide();

            // unsubscribe
            clearTimeout(timer);
          }, 750);
        }

        // close popup if one exists
        if (this.popupWindow.wnd && !this.popupWindow.wnd.closed) {
          this.popupWindow.wnd.close();
          this.popupWindow.wnd = null;
        }

        return;
      
      // if coming from sts server and says a page loaded
      case `${STS_ORIGIN}loaded`:

        // if iframe exists, increment progress bar buffer if required
        if (this.iFrame) {
          switch(this.progressBarBufferValue) {
            
            // if first load
            case 0          : this.fuseProgressBarService.setBufferValue(1/3 * 100); break;

            // later loads (post requests, login attempts)
            case 1/3 * 100  : this.fuseProgressBarService.setBufferValue(2/3 * 100); break;
          }
        }

        // return if no popup exists
        if (!this.popupWindow.wnd) return;
        this.popupWindow.wnd.postMessage({
          action  : 'external_login',
          message : this.popupWindow.external
        }, '*');

        return;

      // if coming from sts server and enumerates the validation errors
      case `${STS_ORIGIN}validation_errors`:
        
        // add error to the form validation controls
        this.loginForm.controls['Password'].setErrors({'message': event.data.message[0]});

        // hide progress bar and reset buffer to 1/3 because the iframe is already loaded
        this.fuseProgressBarService.hide();
        this.fuseProgressBarService.setBufferValue(1/3 * 100);

        return;
        
    }
  }
}
