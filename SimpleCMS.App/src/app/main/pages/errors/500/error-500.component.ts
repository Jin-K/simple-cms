import { Component, ViewEncapsulation } from '@angular/core';

const ERROR_MESSAGES: { [key: string]: string } = {
  sts: 'authentication',
  api: 'api'
};

/**
 * The main Error500Component class
 *
 * @export
 * @class Error500Component
 */
@Component({
  selector: 'error-500',
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Error500Component {

  /**
   * Message to display as reason
   *
   * @type {string}
   * @memberof Error500Component
   */
  message = 'Just kidding, looks like we have an internal issue, please try again in couple minutes';

  /**
   * Constructor
   */
  constructor() {

    // if we have a type defined in url query
    if (window.location.search && ~window.location.search.indexOf('type=')) {

      // extract
      const reasonCode = window.location.search.split('=')[1];

      // find match
      const reason = ERROR_MESSAGES[reasonCode];

      // if match, change error message
      if (reason) this.message = this.message.replace(' an internal issue, ', ` an internal issue with our ${reason} server, ` );
    }

  }

}
