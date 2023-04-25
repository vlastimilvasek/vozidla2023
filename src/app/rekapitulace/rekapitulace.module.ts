import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { RekapitulaceRoutingModule } from './rekapitulace-routing.module';
import { RekapitulaceComponent } from './rekapitulace.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RekapitulaceRoutingModule
    ],
    declarations: [
        RekapitulaceComponent,
    ]
})
export class RekapitulaceModule { }