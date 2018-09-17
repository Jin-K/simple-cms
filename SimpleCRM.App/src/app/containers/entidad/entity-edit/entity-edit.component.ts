import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
// import { ActivatedRoute, Router } from '@angular/router';
import { Observable }             from 'rxjs';
//import { map }                    from 'rxjs/operators';
import { IItem }                  from '../../../models/interfaces';

@Component({
  selector: 'app-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent implements OnInit {

  item$: Observable<IItem>;
  entity: string;

  constructor(
    // private router: Router,
    private route: ActivatedRoute
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.item$ = this.route.data.map(({ item }) => item);
    this.route.params.subscribe(params => this.entity = params.entity);
  }

}
