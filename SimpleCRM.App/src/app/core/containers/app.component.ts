import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../application-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchQuery: string = "";

  constructor(private store: Store<ApplicationState>) {}
}
