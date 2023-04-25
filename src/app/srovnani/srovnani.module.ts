import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { SrovnaniRoutingModule } from './srovnani-routing.module';
import { SrovnaniComponent } from './srovnani.component';
import { SrovnaniDetailComponent } from './srovnani-detail.component';
import { SrovnaniPorovnaniComponent } from './srovnani-porovnani.component';
import { SrovnaniNastaveniComponent } from './srovnani-nastaveni.component';

@NgModule({
  declarations: [
    SrovnaniComponent,
    SrovnaniDetailComponent,
    SrovnaniPorovnaniComponent,
    SrovnaniNastaveniComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SrovnaniRoutingModule
  ]
})
export class SrovnaniModule { }

