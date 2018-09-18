import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { Observable }         from 'rxjs';
import { IItem }              from '../../../../core/models';

@Component({})
export class EntityBaseComponent implements OnInit {
  public item$: Observable<IItem>;
  public entity: string;

  constructor(protected route: ActivatedRoute) { }

  ngOnInit() {
    this.item$ = this.route.data.map(({ item }) => item);
    this.route.params.subscribe(params => this.entity = params.entity);
  }
}
