import { NgModule } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { QuickPanelComponent } from './quick-panel.component';

@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        FuseSharedModule,
    ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule
{
}
