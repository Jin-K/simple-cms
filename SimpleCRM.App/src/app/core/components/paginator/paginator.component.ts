import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostBinding,
  Input,
}                       from '@angular/core';
import { MatPaginator } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-paginator',
  exportAs: 'appPaginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginatorComponent extends MatPaginator {
  @HostBinding('class') classes = 'mat-paginator';
  @Input() selectionLength = 0;
}
