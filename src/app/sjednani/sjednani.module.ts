import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { SjednaniRoutingModule } from './sjednani-routing.module';
import { SjednaniComponent } from '../sjednani/sjednani.component';


@NgModule({
  declarations: [
    SjednaniComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SjednaniRoutingModule,
  ]
})
export class SjednaniModule { }
