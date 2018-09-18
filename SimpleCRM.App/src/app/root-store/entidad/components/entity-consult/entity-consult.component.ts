import { Component, OnInit }    from '@angular/core';
import { EntityBaseComponent }  from './../entity-base/entity-base.component';

@Component({
  selector: 'app-entity-consult',
  templateUrl: './entity-consult.component.html',
  styleUrls: ['./entity-consult.component.scss']
})
export class EntityConsultComponent extends EntityBaseComponent implements OnInit {

  ngOnInit() { super.ngOnInit(); }

}
