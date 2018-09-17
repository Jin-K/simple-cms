import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItem } from '../../../models/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entity-base',
  template: ''
})
export class EntityBaseComponent implements OnInit {
  public item$: Observable<IItem>;
  public entity: string;

  constructor(protected route: ActivatedRoute) { }

  ngOnInit() {
    this.item$ = this.route.data.map(({ item }) => item);
    this.route.params.subscribe(params => this.entity = params.entity);
  }
}
