import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations }                       from '@fuse/animations';

/**
 * The main ChatComponent class.
 *
 * @export
 * @class ChatComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatComponent implements OnInit {

  /**
   * Creates an instance of ChatComponent.
   *
   * @memberof ChatComponent
   */
  constructor() { }

  /**
   * On init
   *
   * @memberof ChatComponent
   */
  ngOnInit() { }

}
