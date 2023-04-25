import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { ParametryRoutingModule } from './parametry-routing.module';
import { ParametryComponent } from '../parametry/parametry.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ParametryRoutingModule
    ],
    declarations: [
        ParametryComponent,
    ]
})
export class ParametryModule { }