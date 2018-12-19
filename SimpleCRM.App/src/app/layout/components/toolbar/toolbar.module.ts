import { NgModule }                                 from '@angular/core';
import { RouterModule }                             from '@angular/router';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule
}                                                   from '@angular/material';
import { TranslateModule }                          from '@ngx-translate/core';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule }                         from '@fuse/shared.module';
import { ToolbarComponent }                         from './toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        TranslateModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
