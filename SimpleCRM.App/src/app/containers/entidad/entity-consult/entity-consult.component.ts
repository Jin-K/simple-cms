import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { Observable }         from 'rxjs';
import { IItem }              from '../../../models/interfaces';

@Component({
  selector: 'app-entity-consult',
  templateUrl: './entity-consult.component.html',
  styleUrls: ['./entity-consult.component.scss']
})
export class EntityConsultComponent implements OnInit {

  item$: Observable<IItem>;
  entity: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.item$ = this.route.data.map(({ item }) => item);
    this.route.params.subscribe(params => this.entity = params.entity);
  }

}
